import {ViewRef, ComponentRef} from '@angular/core';

export class ContentRef {
    constructor(public nodes: any[], public viewRef?: ViewRef, public componentRef?: ComponentRef<any>) {}
}

export function isString(value: any): value is string {
    return typeof value === 'string';
}

export function isDefined(value: any): boolean {
    return value !== undefined && value !== null;
}
