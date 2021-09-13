// Some type overrides for DOM functions, as they normally can return null, and typescript raises hundreds of warnings because of it.
interface Element {
    parentElement: HTMLElement;
    getAttribute(qualifiedName: string): string;
}
interface Document {
    getElementById(id: string): Element;
}
