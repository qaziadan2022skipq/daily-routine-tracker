import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

import { absoluteUrl } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs/server";

const settingsUrl = absoluteUrl("/settings") as string;
const dashboardUrl = absoluteUrl("/dashboard") as string;

export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
      where: { userId: userId },
    });

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });
      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: dashboardUrl,
      cancel_url: settingsUrl,
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Rachel Pro",
              description: "Unlimited AI Generations",
            },
            unit_amount: 999,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        subscription: "monthly"
      },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    console.log("STRIPE_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
