/**
 * Base Entity: identity equality.
 *
 * SRP: an Entity's single responsibility is to model identity — two entities
 * are equal iff their ids are equal, regardless of attribute values.
 */
export abstract class Entity<TId = string> {
  protected constructor(public readonly id: TId) {}

  equals(other?: Entity<TId>): boolean {
    if (other === undefined || other === null) return false;
    if (this === other) return true;
    return this.id === other.id;
  }
}
