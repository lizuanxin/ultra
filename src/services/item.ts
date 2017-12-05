import {Injectable} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TRestClient} from 'UltraCreation/Core/Http';

import {CloudTypes, Config, TAuthService} from './cloud';

@Injectable()
export class TItemService
{
    constructor(private Auth: TAuthService)
    {
    }

    async List(): Promise<Array<CloudTypes.IItem>>
    {
        console.log(this.Snap);

        if (! TypeInfo.Assigned(this.Snap))
        {
            this.Auth.Grant(this.Http);
            const ary: Array<CloudTypes.IItem> = await this.Http.Get('/').toPromise().then(res => res.Content);

            this.Snap = new Map<string, CloudTypes.IItem>();
            for (const iter of ary)
                this.Snap.set(iter.Id, iter);
        }

        console.log(this.Snap);
        return Array.from(this.Snap.values());
    }

    async Open(Id: number): Promise<CloudTypes.IItem>
    {
        return null;
    }

    async AppendProduct(item: CloudTypes.IProduct): Promise<void>
    {
        this.Auth.Grant(this.Http);
        item.TypeId = CloudTypes.TItemTypeId.Product;

        const res = await this.Http.Post('/append', item).toPromise();
        item.Id = res.Content.Id;

        this.Snap.set(item.Id, item);
    }

    async AppendPackage(item: CloudTypes.IPackage): Promise<void>
    {
        this.Auth.Grant(this.Http);
        item.TypeId = CloudTypes.TItemTypeId.Package;

        const res = await this.Http.Post('/append', item).toPromise();
        item.Id = res.Content.Id;
    }

    async Update(item: CloudTypes.IProduct | CloudTypes.IPackage): Promise<void>
    {
        this.Auth.Grant(this.Http);

        switch (item.TypeId)
        {
        case CloudTypes.TItemTypeId.Package:
            const Package = item as CloudTypes.IPackage;
            const ProductList = Package.ProductList as Array<CloudTypes.IProduct>;

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

        case CloudTypes.TItemTypeId.Product:
            await this.Http.Post('/update', item).toPromise();
            break;
        }
    }

    async Remove(item: CloudTypes.IProduct | CloudTypes.IPackage): Promise<void>
    {
        this.Auth.Grant(this.Http);

        await this.Http.Post('/remove', {Id: item.Id}).toPromise();
        this.Snap.delete(item.Id);
    }

    private Http = new TRestClient(Config.API_ENDPOINT + '/item');
    private Snap: Map<string, CloudTypes.IItem>;
}
