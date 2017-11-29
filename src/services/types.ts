export * from './types/index';

export interface IMenuItem
{
    Link?: string;

    Icon?: string;
    LangId: string;
    Gid?: string;
    Role?: string;
    Extend?: boolean;
    Permiss?: boolean;
    Children?: Array<IMenuItem>;
}
