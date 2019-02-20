import { ComponentDoc } from 'react-docgen-typescript/lib';
import { NodePath } from 'babel-traverse';

export interface Options {};

export declare type Handler = (doc:any, path:string) => void;
export declare type Resolver = (ast:any, recast:object) => NodePath;

export declare const defaultHandlers:Handler[];

export declare function parse(filePath:string, resolver?:Resolver, handlers?:Handler[], options?:Options):ComponentDoc;
