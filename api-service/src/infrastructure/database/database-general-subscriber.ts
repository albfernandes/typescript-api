/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";

@EventSubscriber()
export class DatabaseGeneralSubscriber implements EntitySubscriberInterface {
  public afterLoad(entity: any): Promise<any> | void {
    this.changeEntityNullPropertiesToUndefined(entity);
  }

  public afterInsert(entity: InsertEvent<any>): any {
    this.changeEntityNullPropertiesToUndefined(entity);
  }

  public changeEntityNullPropertiesToUndefined(entity: any): Promise<any> | void {
    for (const property in entity) {
      if (Object.prototype.hasOwnProperty.call(entity, property)) {
        entity[property] = entity[property] !== null ? entity[property] : undefined;
      }
    }
  }
}
