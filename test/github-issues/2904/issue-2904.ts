import {
    Connection,
    CreateDateColumn,
    DeepPartial,
    EntityManager,
    getConnection,
    getManager,
    PrimaryGeneratedColumn,
    Transaction,
    TransactionManager,
    UpdateDateColumn,
} from "../../../src";

namespace interfaces {
    export type klass<T> = { new (...args: any[]): T } | Function;
}

export class AuditedEntity {
    @PrimaryGeneratedColumn()
    id: number;

    savedBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export abstract class AbsBaseDao<E, PK = number> {
    conn: Connection;
    manager: EntityManager;
    baseEntity: interfaces.klass<E>;

    constructor(entity: interfaces.klass<E>) {
        this.conn = getConnection();
        this.manager = getManager();
        this.baseEntity = entity;
    }

    @Transaction()
    async create(entity: DeepPartial<E>, @TransactionManager() manager?: EntityManager) {
        return manager!.create(this.baseEntity, entity);
    }
}

export class TestDao<E extends AuditedEntity, PK = number> extends AbsBaseDao<E, PK> {
    async create(entity: DeepPartial<E>, @TransactionManager() manager?: EntityManager) {
        entity.createdAt =  new Date();
        entity.updatedAt = new Date();
        entity.savedBy = 'SomeUSer';

        return super.create(entity);
    }
}
