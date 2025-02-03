import { Types } from 'mongoose';

export class MongooseModelMock<T = any> {
  private data: T[] = [];

  constructor(private defaultData: Partial<T> = {}) {}

  create(data: Partial<T>): Promise<T> {
    const newItem = {
      _id: new Types.ObjectId(),
      ...this.defaultData,
      ...data,
    } as T;
    this.data.push(newItem);
    return Promise.resolve(newItem);
  }

  findById(id: string | Types.ObjectId): any {
    const item = this.data.find((i: any) => i._id.toString() === id.toString());
    return {
      populate: jest.fn().mockResolvedValue(item),
      exec: jest.fn().mockResolvedValue(item),
    };
  }

  findByIdAndUpdate(
    id: string | Types.ObjectId,
    update: any,
    options: any = {}
  ): any {
    const index = this.data.findIndex(
      (i: any) => i._id.toString() === id.toString()
    );

    if (index === -1) {
      return {
        populate: jest.fn().mockResolvedValue(null),
        exec: jest.fn().mockResolvedValue(null),
      };
    }

    const updatedItem = {
      ...this.data[index],
      ...(update.$set || update),
    } as T;

    this.data[index] = updatedItem;

    return {
      populate: jest.fn().mockResolvedValue(updatedItem),
      exec: jest.fn().mockResolvedValue(updatedItem),
    };
  }

  findOne(conditions: any): any {
    const item = this.data.find((i: any) => {
      return Object.entries(conditions).every(
        ([key, value]) => i[key]?.toString() === value?.toString()
      );
    });
    return {
      populate: jest.fn().mockResolvedValue(item),
      exec: jest.fn().mockResolvedValue(item),
    };
  }

  find(conditions: any = {}): any {
    const items = this.data.filter((i: any) => {
      return Object.entries(conditions).every(
        ([key, value]) => i[key]?.toString() === value?.toString()
      );
    });
    return {
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(items),
    };
  }

  findOneAndUpdate(conditions: any, update: any, options: any = {}): any {
    const index = this.data.findIndex((i: any) => {
      return Object.entries(conditions).every(
        ([key, value]) => i[key]?.toString() === value?.toString()
      );
    });

    if (index === -1) {
      return {
        populate: jest.fn().mockResolvedValue(null),
        exec: jest.fn().mockResolvedValue(null),
      };
    }

    const updatedItem = {
      ...this.data[index],
      ...update,
    } as T;

    this.data[index] = updatedItem;

    return {
      populate: jest.fn().mockResolvedValue(updatedItem),
      exec: jest.fn().mockResolvedValue(updatedItem),
    };
  }

  findOneAndDelete(conditions: any): any {
    const index = this.data.findIndex((i: any) => {
      return Object.entries(conditions).every(
        ([key, value]) => i[key]?.toString() === value?.toString()
      );
    });

    if (index === -1) {
      return {
        lean: jest.fn().mockResolvedValue(null),
      };
    }

    const deletedItem = this.data.splice(index, 1)[0];
    return {
      lean: jest.fn().mockResolvedValue(deletedItem),
    };
  }

  countDocuments(conditions: any = {}): Promise<number> {
    const count = this.data.filter((i: any) => {
      return Object.entries(conditions).every(
        ([key, value]) => i[key]?.toString() === value?.toString()
      );
    }).length;
    return Promise.resolve(count);
  }
}
