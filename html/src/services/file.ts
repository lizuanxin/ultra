import {Injectable} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {THttpClient} from 'UltraCreation/Core/Http';

import {Config} from './cloud/config';
import * as Types from './cloud/types';
import {TAuthService} from './auth';

@Injectable()
export class TFileService
{
    constructor(private AuthSvc: TAuthService)
    {
    }

    async List(): Promise<Array<Types.IFile>>
    {
        if (! TypeInfo.Assigned(this.FilesCache))
        {
            this.AuthSvc.Grant(this.Http);
            let Files = await this.Http.Get('/').toPromise().then((res) => res.Content);

            this.FilesCache = new Map<string, Types.IFile>();
            for (let File of Files)
                this.FilesCache.set(File.Id, File);
            console.log(this.FilesCache);
        }

        return Array.from(this.FilesCache.values());
    }

    async Upload(UploadFile: any)
    {
        const form = new FormData();
        form.append('file', UploadFile);

        let UploadHttp = new THttpClient('json', Config.API_ENDPOINT + '/file');
        this.AuthSvc.Grant(UploadHttp);
        return UploadHttp.Post('/upload', form).toPromise().then((res) =>
        {
            console.log(res.Content);
            let Files = res.Content;
            if (TypeInfo.Assigned(Files))
            {
                this.FilesCache.set(Files[0].Id, Files[0]);
                return Files[0];
            }
        });
    }

    async Remove(RemoveFile: Types.IFile)
    {
        this.AuthSvc.Grant(this.Http);
        return this.Http.Post('/remove', RemoveFile).toPromise().then((res) =>
        {
            console.log(JSON.stringify(this.Http.Headers));
            this.FilesCache.delete(RemoveFile.Id);
        });
    }

    private Http = new THttpClient('json', Config.API_ENDPOINT + '/file');
    private FilesCache: Map<string, Types.IFile>;
}
