export default abstract class Migration {
  public abstract readonly version: number;
  abstract async apply(): Promise<void>;
}
