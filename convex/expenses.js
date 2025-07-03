import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const getExpensesBetweenUsers=query({
    args:{userId: v.id("users")},
    handler: async (ctx, {userId})=>{
        const me = await ctx.runQuery(internal.users.getCurrentUser)
        if (me._id == userId){
            throw new Error("Cannot query yourself")
        }
        const otherUser = await ctx.db.get(userId)
        if (!otherUser) {
            throw new Error("User not found")
        }
        const expensesYouPaid= await ctx
        .db
        .query("expenses")
        .withIndex("by_user_and_group", q=>(
            q.eq("paidByUserId", me._id).eq("groupId",undefined)
        ))
        .collect()
        const expensesTheyPaid= await ctx
        .db
        .query("expenses")
        .withIndex("by_user_and_group", q=>(
            q.eq("paidByUserId",userId).eq("groupId",undefined)
        ))
        .collect()

        const candidateExpenses= [...expensesTheyPaid, ...expensesYouPaid]

        const expenses = candidateExpenses.filter((e)=>{
            const meInSplits  = e.splits.some(m=>m.userId==me._id)
            const theyInSplits = e.splits.some(m=>m.userId == userId)

            const meInvolved = e.paidByUserId == me._id ||meInSplits
            const theyInvolved = e.paidByUserId == userId ||theyInSplits

            return meInvolved && theyInvolved
        })
        expenses.sort((a,b)=>b.date-a.date)

        const settlements = await ctx
        .db
        .query("settlements")
        .filter(q=>q.and(
            q.eq(q.field("groupId", undefined)),
            q.or(
                q.and(
                    q.eq(q.field("paidByUserId", me._id)),
                    q.eq(q.field("receivedByUserId", userId))
                ),
                q.and(
                    q.eq(q.field("receivedByUserId",me._id)),
                    q.eq(q.field("paidByUserId",userId))
                )
            )
        ))
        .collect()

        settlements.sort((a,b)=>b.date-a.date)

        let balance =0

        for await (const e of expenses){
            if (e.paidByUserId==me._id) {
                const splitAmount = e.splits.find((s)=>s.userId==userId && !s.paid).amount
                if (splitAmount) {
                    balance += splitAmount
                } 
            }
            else {
                const splitAmount = e.splits.find(s=>!s.paid && s.userId==me._id).amount
                if (splitAmount) {
                        balance -= splitAmount
                    } 
            }
        }
        for(const s of settlements){
            if (s.paidByUserId==me._id) {
                balance+=s.amount
            }
            else balance-=s.amount
        }
        return {
            expenses,
            settlements,
            balance,
            otherUser:{
                id:otherUser._id,
                name:otherUser.name,
                emaail:otherUser.email,
                imageUrl:otherUser.imageUrl
            }
        }
    }
})

export const deleteExpense = mutation({
  args: {
    expenseId: v.id("expenses"),
  },
  handler: async (ctx, args) => {
    // Get the current user
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    // Get the expense
    const expense = await ctx.db.get(args.expenseId);
    if (!expense) {
      throw new Error("Expense not found");
    }

    // Check if user is authorized to delete this expense
    // Only the creator of the expense or the payer can delete it
    if (expense.createdBy !== user._id && expense.paidByUserId !== user._id) {
      throw new Error(`You don't have permission to delete this expense`);
    }

     
    const allSettlements = await ctx.db.query("settlements").collect();

    const relatedSettlements = allSettlements.filter(
      (settlement) =>
        settlement.relatedExpenseIds !== undefined &&
        settlement.relatedExpenseIds.includes(args.expenseId)
    );

    for (const settlement of relatedSettlements) {
      // Remove this expense ID from the relatedExpenseIds array
      const updatedRelatedExpenseIds = settlement.relatedExpenseIds.filter(
        (id) => id !== args.expenseId
      );

      if (updatedRelatedExpenseIds.length === 0) {
        // If this was the only related expense, delete the settlement
        await ctx.db.delete(settlement._id);
      } else {
        // Otherwise update the settlement to remove this expense ID
        await ctx.db.patch(settlement._id, {
          relatedExpenseIds: updatedRelatedExpenseIds,
        });
      }
    }

    // Delete the expense
    await ctx.db.delete(args.expenseId);

    return { success: true };
  },
});

export const createExpense = mutation({
  args: {
    description: v.string(),
    amount: v.number(),
    category: v.optional(v.string()),
    date: v.number(), // timestamp
    paidByUserId: v.id("users"),
    splitType: v.string(), // "equal", "percentage", "exact"
    splits: v.array(
      v.object({
        userId: v.id("users"),
        amount: v.number(),
        paid: v.boolean(),
      })
    ),
    groupId: v.optional(v.id("groups")),
  },
  handler: async (ctx, args) => {
    // Use centralized getCurrentUser function
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    // If there's a group, verify the user is a member
    if (args.groupId) {
      const group = await ctx.db.get(args.groupId);
      if (!group) {  
        throw new Error("Group not found");
      }

      const isMember = group.members.some(
        (member) => member.userId === user._id
      );
      if (!isMember) {
        throw new Error("You are not a member of this group");
      }
    }

    // Verify that splits add up to the total amount (with small tolerance for floating point issues)
    const totalSplitAmount = args.splits.reduce(
      (sum, split) => sum + split.amount,
      0
    );
    const tolerance = 0.01; // Allow for small rounding errors
    if (Math.abs(totalSplitAmount - args.amount) > tolerance) {
      throw new Error("Split amounts must add up to the total expense amount");
    }

    // Create the expense
    const expenseId = await ctx.db.insert("expenses", {
      description: args.description,
      amount: args.amount,
      category: args.category || "Other",
      date: args.date,
      paidByUserId: args.paidByUserId,
      splitType: args.splitType,
      splits: args.splits,
      groupId: args.groupId,
      createdBy: user._id,
    });

    return expenseId;
  },
});
