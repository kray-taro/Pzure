import type { Repository, Clock } from '@pzure/domain';
import { Branch, BranchId, BranchType, Licence } from '@pzure/domain';
import type { UseCase } from '../use-case.js';

export interface RegisterBranchInput {
  branchId: string;
  type: BranchType;
  name: string;
  licences?: readonly Licence[];
}

export interface RegisterBranchOutput {
  branchId: string;
}

/**
 * RegisterBranch use case (Module 1, #14/#15).
 *
 * SRP: orchestrates exactly one use case. DIP + ISP: depends only on the
 * Repository<Branch> and Clock ports it needs — not on any concrete adapter.
 * The Clock is injected so registration time is deterministic and testable.
 *
 * Persistence (and therefore the optimistic-lock version assertion and the
 * outbox write for any BranchRegistered event) is the repository's
 * responsibility per CONCURRENCY §1–§2; this use case stays free of
 * infrastructure concerns.
 */
export class RegisterBranch implements UseCase<RegisterBranchInput, RegisterBranchOutput> {
  constructor(
    private readonly branches: Repository<Branch>,
    private readonly clock: Clock,
  ) {}

  async execute(input: RegisterBranchInput): Promise<RegisterBranchOutput> {
    // clock is available for time-dependent validation/event stamping as the
    // use case grows; registration itself records no time-varying invariant yet.
    void this.clock;
    // Omit `licences` when undefined rather than assigning undefined, to satisfy
    // exactOptionalPropertyTypes against Branch.register's optional property.
    const branch = Branch.register({
      branchId: BranchId.of(input.branchId),
      type: input.type,
      name: input.name,
      ...(input.licences !== undefined ? { licences: input.licences } : {}),
    });
    await this.branches.save(branch);
    return { branchId: branch.branchId.value };
  }
}
