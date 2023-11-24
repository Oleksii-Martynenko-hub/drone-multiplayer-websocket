import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export type GetAttrKeysMethod<T extends Model, A = keyof InferAttributes<T>> = (
  except?: A[]
) => A[];

export class CommonModel<
  T extends Model,
  Options = { omit: never }
> extends Model<
  InferAttributes<T, Options>,
  InferCreationAttributes<T, Options>
> {
  declare static readonly attributes;

  static getAttrKeys(except?: string[]) {
    if (except) {
      return this.attributes.filter(
        (key: string) => !except.includes(key)
      ) as string[];
    }
    return this.attributes as unknown as string[];
  }
}
