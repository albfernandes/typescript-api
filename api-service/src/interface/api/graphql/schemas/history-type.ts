import { Field, ID, ObjectType } from "type-graphql";
import { IHistory } from "../../../../domain/entities/History";

@ObjectType()
export class HistoryType implements IHistory {
  @Field()
  date!: Date;

  @Field()
  userId!: string;

  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  symbol!: string;

  @Field()
  open!: number;

  @Field()
  high!: number;

  @Field()
  low!: number;

  @Field()
  close!: number;
}
