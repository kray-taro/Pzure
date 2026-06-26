import { RegisterBranch } from './register-branch.js';
import type { Repository, Clock } from '@pzure/domain';
import { Branch } from '@pzure/domain';

class InMemoryBranchRepo implements Repository<Branch> {
  readonly saved: Branch[] = [];
  async findById(id: string): Promise<Branch | null> {
    return this.saved.find((b) => b.id === id) ?? null;
  }
  async save(aggregate: Branch): Promise<void> {
    this.saved.push(aggregate);
  }
}

const fixedClock: Clock = { now: () => new Date('2026-06-26T00:00:00Z') };

describe('RegisterBranch use case', () => {
  it('persists a new branch via the repository port', async () => {
    const repo = new InMemoryBranchRepo();
    const useCase = new RegisterBranch(repo, fixedClock);
    const out = await useCase.execute({ branchId: 'br-1', type: 'CHEMIST', name: 'Main' });
    expect(out.branchId).toBe('br-1');
    expect(repo.saved).toHaveLength(1);
    expect(repo.saved[0]?.name).toBe('Main');
  });

  it('rejects an empty branch name (domain invariant)', async () => {
    const useCase = new RegisterBranch(new InMemoryBranchRepo(), fixedClock);
    await expect(useCase.execute({ branchId: 'br-2', type: 'RETAIL', name: '' })).rejects.toThrow();
  });
});
