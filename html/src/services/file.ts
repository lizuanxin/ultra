import {Injectable} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {THttpClient} from 'UltraCreation/Core/Http';

import * as Types from './cloud/types';
import {TAuthService} from './auth';

const SERVER_HOST = 'http://localhost:4200';

@Injectable()
export class TFileService
{
    constructor(private AuthSvc: TAuthService)
    {
        setTimeout(() => this.List(), 100);
    }

    async List(): Promise<Array<Types.IFile>>
    {
        if (! TypeInfo.Assigned(this.FilesCache))
        {
            this.AuthSvc.Grant(this.Http);
            let Files = await this.Http.Get('/').toPromise().then((res) => res.Content);

            this.FilesCache = new Map<string, Types.IFile>();
            for (let UploadedFile of Files)
            {
                UploadedFile.Path = SERVER_HOST + UploadedFile.Path;
                this.FilesCache.set(UploadedFile.Id, UploadedFile);
            }
            console.log(this.FilesCache);
        }

        return Array.from(this.FilesCache.values());
    }

    GetFile(FileId: string): Types.IFile
    {
        if (TypeInfo.Assigned(this.FilesCache))
        {
            return this.FilesCache.get(FileId);
        }
        else
        {
            this.List().catch((err) => console.log(err));
            return null;
        }
    }

    async Upload(UploadFiles: FileList | Array<File>): Promise<Array<Types.IFile>>
    {
        if (UploadFiles.length === 0)
            return Promise.reject(new Error('file is null'));

        const form = new FormData();
        for (let i = 0; i < UploadFiles.length; i++)
            form.append('file' + i, UploadFiles[i]);

        let UploadHttp = new THttpClient('json', '/api/file');
        this.AuthSvc.Grant(UploadHttp);
        return UploadHttp.Post('/upload', form).toPromise().then((res) =>
        {
            console.log(res.Content);
            let Files = res.Content;
            if (TypeInfo.Assigned(Files))
            {
                for (let DownloadFile of Files)
                {
                    this.FilesCache.set(DownloadFile.Id, DownloadFile);
                }
                return Files;
            }
            return [];
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

    private Http = new THttpClient('json', '/api/file');
    private FilesCache: Map<string, Types.IFile>;
}
