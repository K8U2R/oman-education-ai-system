import { PrismaClient, PlanTier } from "@prisma/client";

export class SubscriptionService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUserPlan(userId: string): Promise<PlanTier> {
    const subs = await this.prisma.subscriptions.findFirst({
      where: { user_id: userId, status: "active" },
      orderBy: { created_at: "desc" },
    });
    return subs?.plan_tier || "FREE";
  }

  async upgradeUser(userId: string, tier: PlanTier): Promise<void> {
    // 1. Deactivate old subs
    await this.prisma.subscriptions.updateMany({
      where: { user_id: userId, status: "active" },
      data: { status: "cancelled", end_date: new Date() },
    });

    // 2. Create new sub
    await this.prisma.subscriptions.create({
      data: {
        user_id: userId,
        plan_tier: tier,
        status: "active",
      },
    });

    // 3. Update denormalized field on user for perf
    await this.prisma.users.update({
      where: { id: userId },
      data: { planTier: tier },
    });
  }
}
