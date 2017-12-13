import {Injectable} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TRestClient} from 'UltraCreation/Core/Http';

import {Config} from './cloud/config';
import * as Types from './cloud/types';
import {TAuthService} from './auth';

@Injectable()
export class TItemService
{
    constructor(private Auth: TAuthService)
    {
    }

    async List(): Promise<Array<Types.IItem>>
    {
        console.log(this.Snap);

        if (! TypeInfo.Assigned(this.Snap))
        {
            this.Auth.Grant(this.Http);
            const ary: Array<Types.IItem> = await this.Http.Get('/').toPromise().then(res => res.Content);

            this.Snap = new Map<string, Types.IItem>();
            for (const iter of ary)
                this.Snap.set(iter.Id, iter);
        }

        console.log(this.Snap);
        return Array.from(this.Snap.values());
    }

    async Open(Id: number): Promise<Types.IItem>
    {
        return null;
    }

    async AppendProduct(item: Types.IProduct): Promise<void>
    {
        console.log(item);
        this.Auth.Grant(this.Http);
        item.TypeId = Types.TItemTypeId.Product;

        const res = await this.Http.Post('/append', item).toPromise();
        item.Id = res.Content.Id;

        this.Snap.set(item.Id, item);
    }

    async AppendPackage(item: Types.IPackage): Promise<void>
    {
        this.Auth.Grant(this.Http);
        item.TypeId = Types.TItemTypeId.Package;

        const res = await this.Http.Post('/append', item).toPromise();
        item.Id = res.Content.Id;
    }

    async Update(item: Types.IProduct | Types.IPackage): Promise<void>
    {
        this.Auth.Grant(this.Http);

        switch (item.TypeId)
        {
        case Types.TItemTypeId.Package:
            const Package = item as Types.IPackage;
            const ProductList = Package.ProductList as Array<Types.IProduct>;

            Package.ProductList = new Array<string>();
            ProductList.forEach(iter => Package.ProductList.push(iter.Id));
            try
            {
                await this.Http.Post('/update', item).toPromise();
            }
            finally
            {
                Package.ProductList = ProductList;
            }
            break;

        case Types.TItemTypeId.Product:
            await this.Http.Post('/update', item).toPromise();
            break;
        }
    }

    async Remove(item: Types.IProduct | Types.IPackage): Promise<void>
    {
        this.Auth.Grant(this.Http);

        await this.Http.Post('/remove', {Id: item.Id}).toPromise();
        this.Snap.delete(item.Id);
    }

    private Http = new TRestClient(Config.API_ENDPOINT + '/item');
    private Snap: Map<string, Types.IItem>;
}
