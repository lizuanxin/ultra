import {Injectable} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {THttpClient} from 'UltraCreation/Core/Http';

import * as Types from './cloud/types';
import {TAuthService} from './authorize';

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
                UploadedFile.Path = UploadedFile.Path;
                this.FilesCache.set(UploadedFile.Id, UploadedFile);
            }
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

        return UploadHttp.Put('/upload', form).toPromise().then(res =>
        {
            let Files = res.Content;

            if (TypeInfo.Assigned(Files))
            {
                for (let DownloadFile of Files)
                    this.FilesCache.set(DownloadFile.Id, DownloadFile);

                return Files;
            }
            else
                return [];
        });
    }

    async Remove(File: Types.IFile): Promise<void>
    {
        this.AuthSvc.Grant(this.Http);
        const FileType = File.Path.substring(File.Path.lastIndexOf('.') + 1, 100);

        await this.Http.Delete('/remove', {Id: File.Id, Type: FileType}).toPromise();
        await this.FilesCache.delete(File.Id);
    }

    private Http = new THttpClient('json', '/api/file');
    private FilesCache: Map<string, Types.IFile>;
}
