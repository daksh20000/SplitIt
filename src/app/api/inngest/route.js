import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { paymentReminders } from "@/inngest/paymentReminder";
import {spendingInsights} from "@/inngest/spendingInsightss";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    paymentReminders,
    spendingInsights
  ],
});
