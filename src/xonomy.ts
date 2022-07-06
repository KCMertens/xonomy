// Xonomy instance objects
// ================================

// Note: some properties set to type 'never' on purpose to disambiguate union types in functions.
// If we don't some code may not compile.
// See https://github.com/microsoft/TypeScript/issues/12815#issuecomment-266356277

import {TemplateTag} from 'common-tags'

import '../style/xonomy.css';

const w = new TemplateTag({
	onEndResult(str, context) {
		return str.replace(/>[ \t\n\r]+</g, '><').trim();
	}
})

// Xonomy template definitions
// ======================================
function makeSureDefaultsHaveAllProperties<T>(a: Required<T>) { return a; }
const isAlreadyValidated = Symbol("We add this to docspec and related definitions to mark they've been verified to be valid.");

export type XonomyMenuAction = {
	caption(instance: XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance): string
	action(htmlID: string, actionParameter: any): void
	actionParameter: any
	/** return true to hide this menu action */ 
	hideIf(instance: XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance): boolean
	icon: string
	/**  display string for the keyboard shortcut  */ 
	keyCaption?: string
	/**  check whether the keyboard shortcut is triggered */ 
	keyTrigger?: (e: JQuery.Event) => boolean
	/**  sub-menu, in this case action and actionParameter properties will be ignored. */ 
	menu?: XonomyMenuAction[]
	/**  whether sub-menu is expanded */ 
	expanded(instance: XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance): boolean
	[isAlreadyValidated]?: boolean
}

export type XonomyMenuActionExternal = {
	caption?: XonomyMenuAction['caption']|ReturnType<Required<XonomyMenuAction>['caption']>;
	hideIf?: XonomyMenuAction['hideIf']|ReturnType<Required<XonomyMenuAction>['hideIf']>;
	expanded?: XonomyMenuAction['expanded']|ReturnType<Required<XonomyMenuAction>['expanded']>;

	action?: XonomyMenuAction['action'];
	actionParameter?: any;

	keyCaption?: string;
	keyTrigger?: XonomyMenuAction['keyTrigger']

	menu?: XonomyMenuActionExternal[];
}

export type XonomyElementDefinition = {
	displayName?: (instance: XonomyElementInstance) => string
	title?: (instance: XonomyElementInstance) => string
	caption?: (instance: XonomyElementInstance) => string

	attributes: Record<string, XonomyAttributeDefinition>
	menu: XonomyMenuAction[]
	inlineMenu: XonomyMenuAction[] 
	/**  list of other element names */ 
	canDropTo: string[];

	elementName(): string
	displayValue?(instance: XonomyElementInstance): string
	backgroundColour(instance: XonomyElementInstance): string
	/** allow dropping to another parent? */ 
	localDropOnly(instance: XonomyElementInstance): boolean
	/** if there is a sibling whose name is listed, then it must be this element's preceding sibling */ 
	mustBeAfter?(instance: XonomyElementInstance): string[]
	/** if there is a sibling whose name is listed, then this element must be its preceding sibling */ 
	mustBeBefore?(instance: XonomyElementInstance): string[]
	/**  whether to use a more compact display for this element, only affects display */ 
	oneliner(instance: XonomyElementInstance): boolean
	/**  whether this element's contents are primarily text (perhaps with some inline markup elements) or whether it's just xml nodes, only affects display */ 
	hasText(instance: XonomyElementInstance): boolean
	/**  whether the collapsed state can be toggled by the user */ 
	collapsible(instance: XonomyElementInstance): boolean
	/**  initial state, ignored if collapsible is false */ 
	collapsed(instance: XonomyElementInstance): boolean
	/**  placeholder string for when the element is collapsed */ 
	collapsoid?(instance: XonomyElementInstance): string
	isReadOnly(instance: XonomyElementInstance): boolean
	
	/**  whether to hide this (and all descendants!) in the interface */ 
	isInvisible(instance: XonomyElementInstance): boolean

	/** return html-as-string to render a popup the user can use to input a value */
	asker(currentValue: string, askerParameter: any, instance: XonomyElementInstance|XonomyTextInstance|XonomyAttributeInstance): string|JQuery
	askerParameter: any;
	[isAlreadyValidated]?: boolean;
}

export type XonomyElementDefinitionExternal = {
	displayName?: XonomyElementDefinition['caption']|ReturnType<Required<XonomyElementDefinition>['caption']>;
	title?: XonomyElementDefinition['caption']|ReturnType<Required<XonomyElementDefinition>['caption']>;
	caption?: XonomyElementDefinition['caption']|ReturnType<Required<XonomyElementDefinition>['caption']>;

	elementName?: XonomyElementDefinition['elementName']|ReturnType<Required<XonomyElementDefinition>['elementName']>;
	displayValue?: XonomyElementDefinition['displayValue']|ReturnType<Required<XonomyElementDefinition>['displayValue']>;
	backgroundColour?: XonomyElementDefinition['backgroundColour']|ReturnType<XonomyElementDefinition['backgroundColour']>;
	localDropOnly?: XonomyElementDefinition['localDropOnly']|ReturnType<XonomyElementDefinition['localDropOnly']>;
	mustBeAfter?: XonomyElementDefinition['mustBeAfter']|ReturnType<Required<XonomyElementDefinition>['mustBeAfter']>;
	mustBeBefore?: XonomyElementDefinition['mustBeBefore']|ReturnType<Required<XonomyElementDefinition>['mustBeBefore']>;
	oneliner?: XonomyElementDefinition['oneliner']|ReturnType<XonomyElementDefinition['oneliner']>;
	hasText?: XonomyElementDefinition['hasText']|ReturnType<XonomyElementDefinition['hasText']>;
	collapsible?: XonomyElementDefinition['collapsible']|ReturnType<XonomyElementDefinition['collapsible']>;
	collapsed?: XonomyElementDefinition['collapsed']|ReturnType<XonomyElementDefinition['collapsed']>;
	collapsoid?: XonomyElementDefinition['collapsoid']|ReturnType<Required<XonomyElementDefinition>['collapsoid']>;
	isReadOnly?: XonomyElementDefinition['isReadOnly']|ReturnType<XonomyElementDefinition['isReadOnly']>;
	isInvisible?: XonomyElementDefinition['isInvisible']|ReturnType<XonomyElementDefinition['isInvisible']>;
	
	asker?: XonomyElementDefinition['asker'];
	askerParameter?: any;


	attributes?: { [attributeName: string]: XonomyAttributeDefinitionExternal };
	menu?: XonomyMenuActionExternal[];
	inlineMenu?: XonomyMenuActionExternal[];
	canDropTo?: string[];	
}


export type XonomyAttributeDefinition = {
	displayName?: (instance: XonomyAttributeInstance) => string
	displayValue?: (instance: XonomyAttributeInstance) => string
	title?: (instance: XonomyAttributeInstance) => string
	/**  displayed to the user beside the attribute’s value, as an optional hint to explain the meaning of the value */ 
	caption?: (instance: XonomyAttributeInstance) => string
	isReadOnly?: (instance: XonomyAttributeInstance) => boolean
	isInvisible?: (instance: XonomyAttributeInstance) => boolean
	/**  A shy attribute is invisible, but its owner element is shown with an arrow which the user can click to display all shy elements. This is useful for dealing with elements that have lots of attributes. */ 
	shy?: (instance: XonomyAttributeInstance) => boolean

	/** return html-as-string to render a popup the user can use to input a value */
	asker: (currentValue: string, askerParameter: any, instance: XonomyAttributeInstance) => string|JQuery
	askerParameter?: any
	/** I guess? */
	menu: XonomyMenuAction[]

	[isAlreadyValidated]?: boolean;
}
 
export type XonomyAttributeDefinitionExternal = {
	displayName?: XonomyAttributeDefinition['displayName']|ReturnType<Required<XonomyAttributeDefinition>['displayName']>;
	displayValue?: XonomyAttributeDefinition['displayValue']|ReturnType<Required<XonomyAttributeDefinition>['displayValue']>;
	title?: XonomyAttributeDefinition['title']|ReturnType<Required<XonomyAttributeDefinition>['title']>;
	caption?: XonomyAttributeDefinition['caption']|ReturnType<Required<XonomyAttributeDefinition>['caption']>;
	isReadOnly?: XonomyAttributeDefinition['isReadOnly']|ReturnType<Required<XonomyAttributeDefinition>['isReadOnly']>;
	isInvisible?: XonomyAttributeDefinition['isInvisible']|ReturnType<Required<XonomyAttributeDefinition>['isInvisible']>;
	shy?: XonomyAttributeDefinition['shy']|ReturnType<Required<XonomyAttributeDefinition>['shy']>;

	asker?: XonomyAttributeDefinition['asker'];
	askerParameter?: any;
	menu?: XonomyMenuActionExternal[];
}

export type XonomyDocSpec = {
	elements: Record<string, XonomyElementDefinition>
	unknownElement?: XonomyElementDefinition|((elementID: string) => XonomyElementDefinition)
	unknownAttribute?: XonomyAttributeDefinition|((elementID: string, attributeName: string) => XonomyAttributeDefinition)
	onchange(instance?: XonomyTextInstance|XonomyElementInstance|XonomyAttributeInstance): void
	/**  called with the root element as only argument */ 
	validate(root: XonomyElementInstance): void
	/**  whether to allow switching from 'nerd' to 'laic'? */ 
	allowModeSwitching: boolean
	onModeSwitch(newMode: 'nerd'|'laic'): void
	/**  whether to show a scratchbook-type element on the right-hand side of the screen where elements can temporarily be drag and dropped */ 
	allowLayby: boolean
	/**  placeholder message when the layby area is currently empty */ 
	laybyMessage: string
	/**  Given an element name, and its position in the document, resolve which definition in the DocSpec matches the element. */ 
	getElementId(xmlElementName: string, parentDefinitionId?: string): string

	[isAlreadyValidated]?: boolean;
}


export type XonomyDocSpecExternal = {
	elements?: Record<string, XonomyElementDefinitionExternal>;
	unknownElement?: XonomyElementDefinitionExternal;
	unknownAttribute?: XonomyAttributeDefinitionExternal;
	onchange?: XonomyDocSpec['onchange'];
	validate?: XonomyDocSpec['validate'];
	allowModeSwitching?: boolean;
	onModeSwitch?: XonomyDocSpec['onModeSwitch'];
	allowLayby?: boolean;
	laybyMessage?: string;
	getElementId?: XonomyDocSpec['getElementId'];
}



export type XonomyPickListOption = string|{
	caption: string,
	value: string,
	displayValue?: string
}
export type XonomyWhat = 'openingTagName'|'closingTagName'|'attributeName'|'attributeValue'|'text'|'rollouter'|'warner'|'childrenCollapsed';

// -----------------------------------------


export class XonomyElementInstance {
	readonly type = "element"
	readonly attributes: XonomyAttributeInstance[] = [];
	readonly children: Array<XonomyElementInstance|XonomyTextInstance> = [];

	constructor(
		public xonomy: Xonomy,
		public readonly name: string,
		public readonly elementName: string,
		private _internalParent?: XonomyElementInstance,
		public htmlID?: string,
	) {}

	parent(): XonomyElementInstance|undefined { 
		return this.internalParent; 
	}
	get internalParent(): XonomyElementInstance|undefined {
		this._internalParent = this._internalParent || this.xonomy.harvestParentOf(this);
		return this._internalParent;
	}
	set internalParent(parent: XonomyElementInstance|undefined) {
		this._internalParent = parent;
	}
	
	hasAttribute(name: string): boolean { return this.attributes.some(att => att.name === name); }
	getAttribute(name: string): XonomyAttributeInstance|undefined { return this.attributes.find(att => att.name === name); }
	/** When called without default value, undefined may be returned */
	getAttributeValue(name: string): string|undefined;
	/** When called with a default, the default is returned if the attribute is missing */
	getAttributeValue(name: string, ifNull: string): string;
	getAttributeValue(name: string, ifNull?: string): string|undefined { const att = this.getAttribute(name); return att ? att.value : ifNull; }
	hasElements(): boolean { return this.children.some(c => c.type === 'element'); }
	hasText(): boolean { return this.children.some(c => c.type === 'text'); }
	hasChildElement(elementID: string): boolean { return this.children.some(c => c.htmlID === elementID && c.type === 'element'); }
	getText(): string { return this.children.map(c => c.type === 'text' ? c.value : c.getText()).join(''); }
	getChildElements(elementID: string): XonomyElementInstance[] { return this.children.filter((c): c is XonomyElementInstance => c.type === 'element' && c.name === elementID); }
	getDescendantElements(elementID: string): XonomyElementInstance[] { return this.children.flatMap(c => c.type === 'element' ? [c, ...c.getDescendantElements(elementID)] : []); }
	getPrecedingSibling(): null|XonomyElementInstance {
		if (this.internalParent) {
			let prevSibling = null;
			for (const sib of this.internalParent.children) {
				if (sib === this) return prevSibling;
				else if (sib.type === 'element') prevSibling = sib; // only return element siblings
			}
		}
		return null; // no parent, or we didn't find ourselves in the parent...
	}
	getFollowingSibling(): null|XonomyElementInstance {
		if (this.internalParent) {
			let seenSelf = false;
			for (const sib of this.internalParent.children) {
				if (seenSelf && sib.type === 'element') return sib; // only return element siblings
				else seenSelf = seenSelf || sib === this; // don't reset seenSelf
			}
		}
		return null; // no parent, or we didn't find ourselves in the parent...
	}
	setAttribute(name: string, value: string): void {
		if(this.hasAttribute(name)) this.getAttribute(name)!.value=value;
		else this.attributes.push(new XonomyAttributeInstance(name, value, this));
	}
	addText(text: string): void {
		this.children.push(new XonomyTextInstance(text));
	}
}

export class XonomyAttributeInstance implements XonomyAttributeInstance {
	readonly type = "attribute";
	constructor(
		public readonly name: string,
		public value: string,
		public internalParent: XonomyElementInstance|null = null,
		public htmlID?: string,
	) {}
	
	parent(): XonomyElementInstance|null { return this.internalParent; }
}

export class XonomyTextInstance implements XonomyTextInstance {
	readonly type = "text";
	constructor(
		public value: string,
		public internalParent: XonomyElementInstance|null = null,
		public htmlID?: string,
	) {}

	parent(): XonomyElementInstance|null { return this.internalParent; }
}

// Xonomy must be an object, or overwriting properties/functions (such as asker) at runtime wouldn't work.
export class Xonomy {
	/** Container root */
	$div = $();
	lang = ""; //"en"|"de"|fr"| ...
	mode = "nerd" as 'nerd'|'laic'; //"nerd"|"laic"
	namespaces = {} as Record<string, string>; //eg. "xmlns:mbm": "http://lexonista.com"
	lastIDNum = 0;
	docSpec = {} as XonomyDocSpec; // valid docspec will be set/generated set on first render
	harvestCache = {} as Record<string, XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance>;
	draggingID = null as null|string; //what are we dragging?
	notclick = false; //should the latest click-off event be ignored?
	lastAskerParam = null as any; // todo check usage
	
	// when-you-can - async requests to create autocompletions
	wycLastID= 0;
	wycCache= {} as Record<string, any>; // todo check if we can narrow the type a bit
	
	warnings= [] as Array<{htmlID: string, text: string}>; // filled by plugin function this.verify

	// keyboard navigation focus variables
	currentHtmlId= null as null|string;
	currentFocus= null as null|XonomyWhat;
	keyNav= false;
	
	lastClickWhat= "" as XonomyWhat;
	
	textFromID= "";
	textTillID= "";
	textFromIndex= 0;
	textTillIndex= 0;

	keyboardEventCatcher= null as null|JQuery<HTMLElement>;
	scrollableContainer= null as null|JQuery<HTMLElement>;

	/** Ignore the next keyUp event */
	notKeyUp= false;

	// bookkeeping for when user clicks a word in the xml
	// When the word is first clicked, save the word and its index in the sentence
	// Then when a specific menu option is used to wrap the word in some html, (in Xonomy.wrap()), we know which word we should target.
	wrapIndex = null as null|number;
	wrapWord = null as null|string;

	answer = null as null|((val: string) => void);

	constructor() {
		this.verifyDocSpec();
	}

	setMode(mode: 'nerd'|'laic') {
		if(mode=="nerd" || mode=="laic") this.mode=mode;
		if(mode=="nerd") this.$div.removeClass("laic").addClass("nerd");
		if(mode=="laic") this.$div.removeClass("nerd").addClass("laic");
	}

	static jsEscape(str: string) {
		return String(str)
				.replace(/\"/g, '\\\"')
				.replace(/\'/g, '\\\'')
	}
	static xmlEscape(str: string, jsEscape?: boolean) {
		if(jsEscape) str=this.jsEscape(str);
		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}
	static xmlUnscape(value: string){
		return String(value)
			.replace(/&quot;/g, '"')
			.replace(/&apos;/g, "'")
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&amp;/g, '&');
	}
	static isNamespaceDeclaration(attributeName: string) {
		//Tells you whether an attribute name is a namespace declaration.
		var ret=false;
		if(attributeName=="xmlns") ret=true;
		if(attributeName.length>=6 && attributeName.substring(0, 6)=="xmlns:") ret=true;
		return ret;
	}
	xml2js(xml: string|Document|Element, jsParent?: XonomyElementInstance) {
		if(typeof(xml)=="string") xml=$.parseXML(xml);
		if('documentElement' in xml) xml=xml.documentElement;

		const elementName = xml.nodeName;
		const elementID = this.docSpec.getElementId(xml.nodeName, jsParent ? jsParent.name : undefined);
		var js = new XonomyElementInstance(this, elementID,elementName);
		
		for(var i=0; i<xml.attributes.length; i++) {
			var attr=xml.attributes[i];
			if(!Xonomy.isNamespaceDeclaration(attr.nodeName)) {
				if(attr.name!="xml:space") {
					js.setAttribute(attr.nodeName, attr.value);
				}
			} else {
				this.namespaces[attr.nodeName]=attr.value;
			}
		}
		for(var i=0; i<xml.childNodes.length; i++) {
			var child=xml. childNodes[i];
			if(child.nodeType==1) { //element node
				js.children.push(this.xml2js(child as Element, js));
			}
			if(child.nodeType==3) { //text node
				js.children.push(new XonomyTextInstance(child.nodeValue || '', js));
			}
		}
		return js;
	}
	js2xml(js: XonomyElementInstance|XonomyTextInstance|XonomyAttributeInstance) {
		if(js.type=="text") {
			return Xonomy.xmlEscape(js.value);
		} else if(js.type=="attribute") {
			return js.name+"='"+Xonomy.xmlEscape(js.value)+"'";
		} else if(js.type=="element") {
			var xml="<"+js.elementName;
			for(var i=0; i<js.attributes.length; i++) {
				var att=js.attributes[i];
				xml+=" "+att.name+"='"+Xonomy.xmlEscape(att.value)+"'";
			}
			if(js.children.length>0) {
				var hasText=false;
				for(var i=0; i<js.children.length; i++) {
					var child=js.children[i];
					if(child.type=="text") hasText=true;
				}
				if(hasText) xml+=" xml:space='preserve'";
				xml+=">";
				for(var i=0; i<js.children.length; i++) {
					var child=js.children[i];
					if(child.type=="text") xml+=Xonomy.xmlEscape(child.value); //text node
					else if(child.type=="element") xml+=this.js2xml(child); //element node
				}
				xml+="</"+js.elementName+">";
			} else {
				xml+="/>";
			}
			return xml;
		}
		return '';
	}

	static asFunction<T, I extends XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance>(specProperty: T|undefined|((inst: I) => T)|(() => T), defaultValue: T): (inst: I) => T {
		if(specProperty instanceof Function)
			return specProperty;
		else if (typeof(specProperty)==typeof(defaultValue))
			return function() { return specProperty as T; }
		else
			return function() { return defaultValue };
	}

	verifyDocSpec() { //make sure the docSpec object has everything it needs
		if(!$.isPlainObject(this.docSpec)) this.docSpec={} as XonomyDocSpec;
		const spec = this.docSpec as Partial<XonomyDocSpec>;
		if (spec[isAlreadyValidated]) return;
		Object.assign(spec, makeSureDefaultsHaveAllProperties<XonomyDocSpec>({
			allowLayby: typeof spec.allowLayby === 'boolean' ? spec.allowLayby : false,
			allowModeSwitching: typeof spec.allowModeSwitching === 'boolean' ? spec.allowModeSwitching : false,
			elements: $.isPlainObject(spec.elements) ? spec.elements! : {},
			getElementId: spec.getElementId instanceof Function ? spec.getElementId : function(elementName: string, parentID: string) { return elementName; },
			laybyMessage: typeof spec.laybyMessage === 'string' ? spec.laybyMessage : '',
			onModeSwitch: spec.onModeSwitch instanceof Function ? spec.onModeSwitch : function() {},
			onchange: spec.onchange instanceof Function ? spec.onchange : function() {},
			unknownAttribute: (spec.unknownAttribute instanceof Function || $.isPlainObject(spec.unknownAttribute)) ? spec.unknownAttribute : undefined as any,
			unknownElement: (spec.unknownElement instanceof Function || $.isPlainObject(spec.unknownElement)) ? spec.unknownElement : undefined as any,
			validate: spec.validate instanceof Function ? spec.validate : function() {},
			[isAlreadyValidated]: true
		}));
	}

	verifyDocSpecElement(name: string) { //make sure the DocSpec object has such an element, that the element has everything it needs
		if(!$.isPlainObject(this.docSpec.elements[name])) {
			const unknownElement = this.docSpec.unknownElement;
			this.docSpec.elements[name] = 
				unknownElement instanceof Function ? unknownElement(name) : 
				$.isPlainObject(unknownElement) ? Object.assign({}, unknownElement) :
				{} as XonomyElementDefinition;
		}
		const spec = this.docSpec.elements[name] as Partial<XonomyElementDefinition>;
		if (spec[isAlreadyValidated]) return;
		Object.assign(spec, makeSureDefaultsHaveAllProperties<XonomyElementDefinition>({
			asker: spec.asker instanceof Function ? spec.asker : this.askLongString,
			askerParameter: spec.askerParameter,
			attributes: $.isPlainObject(spec.attributes) ? spec.attributes! : {},
			backgroundColour: Xonomy.asFunction(spec.backgroundColour, ''),
			canDropTo: Array.isArray(spec.canDropTo) ? spec.canDropTo : [],
			caption: 'caption' in spec ? Xonomy.asFunction(spec.caption, '') : undefined as any,
			collapsed: Xonomy.asFunction(spec.collapsed, false),
			collapsible: Xonomy.asFunction(spec.collapsible, true),
			collapsoid: 'collapsoid' in spec ? Xonomy.asFunction(spec.collapsoid, '') : undefined as any,
			displayName: 'displayName' in spec ? Xonomy.asFunction(spec.displayName, name) : undefined as any,
			displayValue: 'displayValue' in spec ? Xonomy.asFunction(spec.displayValue, '') : undefined as any,
			// @ts-ignore
			elementName: Xonomy.asFunction(spec.elementName, name),
			hasText: Xonomy.asFunction(spec.hasText, false),
			inlineMenu: Array.isArray(spec.inlineMenu) ? spec.inlineMenu : [],
			isInvisible: 'isInvisible' in spec ? Xonomy.asFunction(spec.isInvisible, false) : undefined as any,
			isReadOnly: 'isReadOnly' in spec ? Xonomy.asFunction(spec.isReadOnly, false) : undefined as any,
			localDropOnly: Xonomy.asFunction(spec.localDropOnly, false),
			menu: Array.isArray(spec.menu) ? spec.menu : [],
			mustBeAfter: 'mustBeAfter' in spec ? Xonomy.asFunction(spec.mustBeAfter, []) : undefined as any,
			mustBeBefore: 'mustBeBefore' in spec ? Xonomy.asFunction(spec.mustBeBefore, []) : undefined as any,
			oneliner: Xonomy.asFunction(spec.oneliner, false),
			title: 'title' in spec ? Xonomy.asFunction(spec.title, '') : undefined as any,
			[isAlreadyValidated]: true
		}));
		
		for(var i=0; i<spec.menu!.length; i++) Xonomy.verifyDocSpecMenuItem(spec.menu![i]);
		for(var i=0; i<spec.inlineMenu!.length; i++) Xonomy.verifyDocSpecMenuItem(spec.inlineMenu![i]);
		for(var attributeName in spec.attributes) this.verifyDocSpecAttribute(name, attributeName);
	}
	verifyDocSpecAttribute(elementName: string, attributeName: string) { //make sure the DocSpec object has such an attribute, that the attribute has everything it needs
		this.verifyDocSpecElement(elementName);
		const elSpec = this.docSpec.elements[elementName];
		if(!$.isPlainObject(elSpec.attributes[attributeName])) {
			const unknownAttribute = this.docSpec.unknownAttribute;
			elSpec.attributes[attributeName] = 
				unknownAttribute instanceof Function ? unknownAttribute(elementName, attributeName) : 
				$.isPlainObject(unknownAttribute) ? Object.assign({}, unknownAttribute) :
				{} as XonomyAttributeDefinition;
		}
		const spec = elSpec.attributes[attributeName] as Partial<XonomyAttributeDefinition>;
		if (spec[isAlreadyValidated]) return;
		Object.assign(spec, makeSureDefaultsHaveAllProperties<XonomyAttributeDefinition>({
			asker: spec.asker instanceof Function ? spec.asker : this.askString,
			askerParameter: spec.askerParameter,
			caption: 'caption' in spec ? Xonomy.asFunction(spec.caption, '') : undefined as any,
			displayName: 'displayName' in spec ? Xonomy.asFunction(spec.displayName, attributeName) : undefined as any,
			displayValue: 'displayValue' in spec ? Xonomy.asFunction(spec.displayValue, '') : undefined as any,
			title: 'title' in spec ? Xonomy.asFunction(spec.title, '') : undefined as any,
			isInvisible: 'isInvisible' in spec ? Xonomy.asFunction(spec.isInvisible, false) : undefined as any,
			isReadOnly: 'isReadOnly' in spec ? Xonomy.asFunction(spec.isReadOnly, false) : undefined as any,
			menu: Array.isArray(spec.menu) ? spec.menu : [],
			shy: 'shy' in spec ? Xonomy.asFunction(spec.shy, false) : undefined as any,
			[isAlreadyValidated]: true
		}));

		for(var i=0; i<spec.menu!.length; i++) Xonomy.verifyDocSpecMenuItem(spec.menu![i]);
	}
	static verifyDocSpecMenuItem(menuItem: XonomyMenuAction) { //make sure the menu item has all it needs
		if (menuItem[isAlreadyValidated]) return;
		Object.assign(menuItem, makeSureDefaultsHaveAllProperties<XonomyMenuAction>({
			action: menuItem.action instanceof Function ? menuItem.action : function(){},
			actionParameter: menuItem.actionParameter,
			caption: this.asFunction(menuItem.caption, '?'),
			expanded: this.asFunction(menuItem.expanded, false),
			hideIf: this.asFunction(menuItem.hideIf, false),
			icon: typeof menuItem.icon === 'string' ? menuItem.icon : undefined as any,
			keyCaption: typeof menuItem.keyCaption === 'string' ? menuItem.keyCaption : undefined as any,
			keyTrigger: menuItem.keyTrigger instanceof Function ? menuItem.keyTrigger : undefined as any,
			menu: Array.isArray(menuItem.menu) ? menuItem.menu : undefined as any,
			[isAlreadyValidated]: true
		}))
		
		menuItem.caption=this.asFunction(menuItem.caption, "?");
		if(!menuItem.action || typeof(menuItem.action)!="function") menuItem.action=function(){};
		if(!menuItem.hideIf) menuItem.hideIf=function(){return false;};
		if(typeof(menuItem.expanded)!="function") menuItem.expanded=this.asFunction(menuItem.expanded, false);
	}

	nextID() {
		return "xonomy"+(++this.lastIDNum);
	}

	refresh() {
		const self = this;
		this.$div.find(".textnode[data-value='']").each(function(){ //delete empty text nodes if the parent element is not allowed to have text
			var $this=$(this);
			var $parent=$this.closest(".element");
			var parentName=$parent.data("name");
			var elSpec=self.docSpec.elements[parentName];
			if(elSpec && !elSpec.hasText(self.harvestElement($parent.toArray()[0]))) {
				$this.remove();
			}
		});
		this.$div.find(".children ").each(function(){ //determine whether each element does or doesn't have children:
			if(this.childNodes.length==0 && !$(this.parentElement!).hasClass("hasText")) $(this.parentElement!).addClass("noChildren");
			else {
				$(this.parentElement!).removeClass("noChildren");
				self.updateCollapsoid(this.parentElement!.id);
			}
		});
		this.$div.find(".element.hasText > .children > .element").each(function () { //determine whether each child element of hasText element should have empty text nodes on either side
			if($(this).prev().length == 0 || !$(this).prev().hasClass("textnode")) {
				$(this).before(self.renderText(new XonomyTextInstance("")));
			}
			if($(this).next().length == 0 || !$(this).next().hasClass("textnode")) {
				$(this).after(self.renderText(new XonomyTextInstance("")));
			}
		});
		var merged=false; 
		while(!merged) { //merge adjacent text nodes
			merged=true; 
			var textnodes=this.$div.find(".textnode").toArray();
			for(var i=0; i<textnodes.length; i++) {
				var $this=$(textnodes[i]);
				if($this.next().hasClass("textnode")) {
					var js1=this.harvestText($this.toArray()[0]);
					var js2=this.harvestText($this.next().toArray()[0]);
					js1.value+=js2.value;
					$this.next().remove();
					$this.replaceWith(this.renderText(js1));
					merged=false;
					break;
				}
			}
		}
		this.$div.find(".attribute ").each(function(){ //reorder attributes if necessary
			var atName=this.getAttribute("data-name");
			var elName=this.parentElement!.parentElement!.parentElement!.getAttribute("data-name")!;
			var elSpec=self.docSpec.elements[elName];
			var mustBeAfter=[]; for(var sibName in elSpec.attributes) {
				if(sibName==atName) break; else mustBeAfter.push(sibName);
			}
			var mustBeBefore=[]; var seen=false; for(var sibName in elSpec.attributes) {
				if(sibName==atName) seen=true; else if(seen) mustBeBefore.push(sibName);
			}
			if(mustBeBefore.length>0) { //is it after an attribute it cannot be after? then move it up until it's not!
				var $this=$(this);
				var ok; do {
					ok=true;
					for(var ii=0; ii<mustBeBefore.length; ii++) {
						if( $this.prevAll("*[data-name='"+mustBeBefore[ii]+"']").toArray().length>0 ) {
							$this.prev().before($this);
							ok=false;
						}
					}
				} while(!ok)
			}
			if(mustBeAfter.length>0) { //is it before an attribute it cannot be before? then move it down until it's not!
				var $this=$(this);
				var ok; do {
					ok=true;
					for(var ii=0; ii<mustBeAfter.length; ii++) {
						if( $this.nextAll("*[data-name='"+mustBeAfter[ii]+"']").toArray().length>0 ) {
							$this.next().after($this);
							ok=false;
						}
					}
				} while(!ok)
			}
		});
		this.$div.find(".attributes").each(function(){ //determine whether each attribute list has any shy attributes:
			if($(this).children(".shy").toArray().length==0) {
				$(this.parentElement!).children(".rollouter").hide().removeClass("rolledout");
				$(this).removeClass("rolledout").css("display", "");
			} else {
				$(this.parentElement!).children(".rollouter").show();
			}
		});
		this.$div.find(".element").each(function(){ //refresh display names, display values and captions:
			var elSpec=self.docSpec.elements[this.getAttribute("data-name")!];
			if(elSpec.displayName) $(this).children(".tag").children(".name").empty().append(self.textByLang(elSpec.displayName(self.harvestElement(this))));
			if(elSpec.caption) {
				var jsEl=self.harvestElement(this);
				$(this).children(".inlinecaption").empty().append(self.textByLang(elSpec.caption(jsEl)));
			}
			if(elSpec.displayValue) {
				var jsEl=self.harvestElement(this);
				if(!jsEl.hasElements()) $(this).children(".children").empty().append(self.renderDisplayText(jsEl.getText(), elSpec.displayValue(jsEl)));
			}
			$(this).children(".tag.opening").children(".attributes").children(".attribute").each(function(){
				var atSpec=elSpec.attributes[this.getAttribute("data-name")!];
				if(atSpec.displayName) $(this).children(".name").empty().append(self.textByLang(atSpec.displayName(self.harvestAttribute(this))));
				if(atSpec.displayValue) $(this).children(".value").empty().append(self.textByLang(atSpec.displayValue(self.harvestAttribute(this))));
				if(atSpec.caption) $(this).children(".inlinecaption").empty().append("&nbsp;"+self.textByLang(atSpec.caption(self.harvestAttribute(this)))+"&nbsp;");
			});
		});
	}

	/**
	 * harvests the contents of an editor
	 * Returns xml-as-string.
	 * @returns {string}
	 */
	harvest() {
		var rootElement=this.$div.find(".element").first().toArray()[0];
		var js=this.harvestElement(rootElement);
		for(var key in this.namespaces) {
			if(!js.hasAttribute(key)) js.attributes.push(new XonomyAttributeInstance(key, this.namespaces[key], js));
		}
		return this.js2xml(js);
	}
	harvestElement(htmlElement: Element, jsParent?: XonomyElementInstance) {
		var htmlID=htmlElement.id;
		if(!this.harvestCache[htmlID]) {
			const definitionID = htmlElement.getAttribute('data-name')!;
			const def=this.docSpec.elements[definitionID];
			var js=new XonomyElementInstance(this, definitionID, def.elementName(), jsParent, htmlElement.id);
			var htmlAttributes=$(htmlElement).find(".tag.opening > .attributes").toArray()[0];
			for(var i=0; i<htmlAttributes.children.length; i++) {
				var htmlAttribute=htmlAttributes.children[i];
				if($(htmlAttribute).hasClass("attribute")) js.attributes.push(this.harvestAttribute(htmlAttribute, js));
			}
			var htmlChildren=$(htmlElement).children(".children").toArray()[0];
			for(var i=0; i<htmlChildren.children.length; i++) {
				var htmlChild=htmlChildren.children[i];
				if($(htmlChild).hasClass("element")) js.children.push(this.harvestElement(htmlChild, js));
				else if($(htmlChild).hasClass("textnode")) js.children.push(this.harvestText(htmlChild, js));
			}
			this.harvestCache[htmlID]=js;
		}
		return this.harvestCache[htmlID] as XonomyElementInstance;
	}
	harvestAttribute(htmlAttribute: Element, jsParent?: XonomyElementInstance) {
		var htmlID=htmlAttribute.id;
		if(!this.harvestCache[htmlID]) {
			this.harvestCache[htmlID] = new XonomyAttributeInstance(
				htmlAttribute.getAttribute("data-name")!,
				htmlAttribute.getAttribute("data-value")!,
				jsParent,
				htmlAttribute.id
			);
		}
		return this.harvestCache[htmlID] as XonomyAttributeInstance;
	}

	harvestText(htmlText: Element, jsParent?: XonomyElementInstance) {
		var htmlID=htmlText.id;
		if(!this.harvestCache[htmlID]) {
			this.harvestCache[htmlID] = new XonomyTextInstance(
				htmlText.getAttribute("data-value")!,
				jsParent,
				htmlText.id
			);
		}
		return this.harvestCache[htmlID] as XonomyTextInstance;
	}
	/** Return the parent element harvest. The js argument is put in the element's attributes/children array instead of whatever is harvested there. */
	harvestParentOf(js: XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance): undefined|XonomyElementInstance {
		var jsParent=undefined;
		var $parent=$("#"+js.htmlID).parent().closest(".element");
		if($parent.toArray().length==1) {
			jsParent=this.harvestElement($parent.toArray()[0]);
			for(var i=0; i<jsParent.attributes.length; i++) if(jsParent.attributes[i].htmlID==js.htmlID && js.type === 'attribute') jsParent.attributes[i]=js;
			for(var i=0; i<jsParent.children.length; i++) if(jsParent.children[i].htmlID==js.htmlID && js.type === 'element') jsParent.children[i]=js;
		}
		return jsParent;
	}
	render(data: string|Document|XonomyElementInstance, editor: string|HTMLElement, docSpec: XonomyDocSpec) { //renders the contents of an editor
		const self = this;
		//The data can be a Xonomy-compliant XML document, a Xonomy-compliant xml-as-string,
		//or a Xonomy-compliant JavaScript object.
		//The editor can be an HTML element, or the string ID of one.
		this.docSpec=docSpec;
		this.verifyDocSpec();

		//Clear namespace cache:
		this.namespaces={};

		// Make sure editor refers to an HTML element, if it doesn't already:
		this.$div = $(editor as any);
		if (!this.$div.length) this.$div = $(document.getElementById(editor as string) as HTMLElement); // try again with normal ID selection 
		this.$div.addClass("xonomy").addClass(this.mode);

		//Convert doc to a JavaScript object, if it isn't a JavaScript object already:
		if(typeof(data)=="string") {
			[...data.matchAll(/ ([a-zA-Z]+):[^=]+=/g)].forEach(function(nsel) {
				var nsname = nsel[1];
				var re = new RegExp('xmlns:'+nsname+'=');
				if (nsname != 'xmlns' && nsname != 'lxnm' && nsname != 'xml' && (data as string).match(re) == null) {
					data = (data as string).replace(' xmlns:lxnm', ' xmlns:'+nsname+'="'+nsname+'" xmlns:lxnm');
				}
			});
			try {
				data=$.parseXML(data);
			} catch(e) {
				$('.alertmessage .text', parent.document).html('Error parsing entry XML.')
				$('.alertmessage', parent.document).show();
				data = $.parseXML('<entry/>');
			}
		}
		if(data instanceof Document) data=this.xml2js(data);

		this.$div.hide().empty().append(this.renderElement(data)).show();

		if(docSpec.allowLayby){
			const layby = $(w`
			<div class='layby closed empty'>
				<span class='button closer'>&nbsp;</span>
				<span class='button purger'>&nbsp;</span>
				<div class='content'></div>
				<div class='message'>${this.textByLang(docSpec.laybyMessage)}</div>
			</div>`);
			layby.appendTo(this.$div);

			layby.on('click', function() { if($(this).hasClass("closed")) self.openLayby() });
			layby.on('dragover', function(event) { self.dragOver(event.originalEvent!) });
			layby.on('dragleave', function(event) { self.dragOut(event.originalEvent!) });
			layby.on('drop', function(event) { self.drop(event.originalEvent!) });
			layby.on('click', '.closer', function(event) { self.closeLayby() });
			layby.on('click', '.purger', function(event) { self.emptyLayby() });
		}

		if(docSpec.allowModeSwitching){
			$("<div class='modeSwitcher'><span class='nerd'></span><span class='laic'></span></div>")
			.on("click", function(e){
				if(self.mode=="nerd") { self.setMode("laic"); } else { self.setMode("nerd"); }
				if(docSpec.onModeSwitch) docSpec.onModeSwitch(self.mode);
			})
			.appendTo(this.$div);
		}

		//Make sure the "click off" handler is attached:
		$(document.body).off("click", this.boundClickOff);
		$(document.body).on("click", this.boundClickOff);

		//Make sure the "drag end" handler is attached:
		$(document.body).off("dragend", this.boundDragend);
		$(document.body).on("dragend", this.boundDragend);

		this.refresh();
		this.validate();
	}

	/*
		Boilerplate for jquery.on() and jquery.off()
		Why? jquery.on('event', this.someFunction) will have 'this' replaced when actually called
		So we need to bind 'this' to make sure it still points to Xonomy when the handler fires (instead of the default where it points to the html element that fired the event)
		But the following WILL NOT work
		$.on('event', this.someFunction.bind(this))
		(...later) $.off('event', this.someFunction.bind(this))
		Result: the call to off() won't actually remove, because a copy of the function is passed in, and not the original

		So what we need to do is something like
		const boundFunction = this.someFunction.bind(this)
		$.on('event', boundFunction)
		$.off('event', boundFunction) // NOTE: the SAME exact function object, now it will work

		So yeah, make some getters and keep the bound function object around for later removal.
	*/
	_boundClickOff?: (e: JQuery.ClickEvent) => void;
	_boundDragend?: (e: JQuery.DragEndEvent) => void;
	get boundClickOff() {
		if (!this._boundClickOff) this._boundClickOff = event => this.clickoff(event);
		return this._boundClickOff;
	} 
	get boundDragend() {
		if (!this._boundDragend) this._boundDragend = event => this.dragend(event.originalEvent!);
		return this._boundDragend;
	}

	renderElement(element: XonomyElementInstance): JQuery<HTMLElement> {
		const htmlID=element.htmlID=this.nextID();
		this.verifyDocSpecElement(element.name);
		var spec=this.docSpec.elements[element.name];
		var hasText = spec.hasText(element);
		var classNames = Object.entries({
			element: true,
			draggable: spec.canDropTo && spec.canDropTo.length,
			hasText,
			hasInlineMenu: spec.inlineMenu && spec.inlineMenu.length,
			oneliner: spec.oneliner(element),
			uncollapsible: !spec.collapsible(element),
			collapsed: spec.collapsible(element) && spec.collapsed(element) && element.children.length,
			invisible: spec.isInvisible && spec.isInvisible(element),
			readonly: spec.isReadOnly && spec.isReadOnly(element),
			hasMenu: spec.menu.length, // not always accurate: whether an element has a menu is actually determined at runtime
		}).filter(([k, v]) => v).map(([k, v]) => k).join(' ')

		var displayName= spec.displayName ? this.textByLang(spec.displayName(element)) : element.elementName;
		var title = spec.title ? this.textByLang(spec.title(element)) : '';

		const $html = $(w`
		<div data-name="${element.name}" id="${htmlID}" class="${classNames}">
			<span class="connector">
				<span class="plusminus"></span>
				<span class="draghandle" draggable="true"></span>
			</span>
			<span class="tag opening focusable" style="background-color: '${spec.backgroundColour(element)}';">
				<span class="punc">&lt;</span>
				<span class="warner"><span class="inside"></span></span>
				<span class="name" title="${title}">${displayName}</span>
				
				<span class="attributes"></span>
				
				<span class="rollouter focusable"></span>
				<span class="punc slash">/</span>
				<span class="punc">&gt;</span>
			</span>
			${spec.caption && !spec.oneliner(element) ? `<span class='inlinecaption'>${this.textByLang(spec.caption(element))}</span>` : ''}
			<span class="childrenCollapsed focusable">&middot;&middot;&middot;</span>
			
			<div class="children"></div>

			<span class="tag closing focusable" style="background-color: '${spec.backgroundColour(element)}';">
				<span class="punc">&lt;</span>
				<span class="punc">/</span>
				<span class="name">${displayName}</span>
				<span class="punc">&gt;</span>
			</span>

			${spec.caption && spec.oneliner(element) ? `<span class='inlinecaption'>${this.textByLang(spec.caption(element))}</span>` : ''}
		</div>`)

		// attach event handler to actual elements, or bubbled events from descendants would also match
		$html.find('.plusminus'        ).on('click',     e => { this.plusminus(htmlID); });
		$html.find('.draghandle'       ).on('dragstart', e => { this.drag(e.originalEvent!); });
		$html.find('.inside'           ).on('click',     e => { this.click(htmlID, 'warner'); });
		$html.find('.opening > .name'  ).on('click',     e => { this.click(htmlID, 'openingTagName'); });
		$html.find('.rollouter'        ).on('click',     e => { this.click(htmlID, 'rollouter'); });
		$html.find('.childrenCollapsed').on('click',     e => { this.plusminus(htmlID, true); });
		$html.find('.closing > .name'  ).on('click',     e => { this.click(htmlID, 'closingTagName'); });

		const $attributes = $html.find('.attributes');
		for(var i=0; i<element.attributes.length; i++) {
			this.verifyDocSpecAttribute(element.name, element.attributes[i].name);
			$attributes.append(this.renderAttribute(element.attributes[i], element.name));
		}

		const $children = $html.find('.children')

		if(spec.displayValue && !element.hasElements()) {
			$children.append(this.renderDisplayText(element.getText(), spec.displayValue(element)))
		} else {
			if(hasText && (element.children.length==0 || element.children[0].type=="element")) {
				$children.append(this.renderText(new XonomyTextInstance(""))); //if inline layout, insert empty text node between two elements
			}
			var prevChildType="";
			for(var i=0; i<element.children.length; i++) {
				var child=element.children[i];
				if(hasText && prevChildType=="element" && child.type=="element") {
					$children.append(this.renderText(new XonomyTextInstance(""))) //if inline layout, insert empty text node between two elements
				}
				if(child.type=="text") $children.append(this.renderText(child)); //text node
				else if(child.type=="element") $children.append(this.renderElement(child)); //element node
				prevChildType=child.type;
			}
			if(hasText && element.children.length>1 && element.children[element.children.length-1].type=="element") {
				$children.append(this.renderText(new XonomyTextInstance(""))); //if inline layout, insert empty text node between two elements
			}
		}
		
		return $html;
	}
	renderAttribute(attribute: XonomyAttributeInstance, optionalParentName?: string): JQuery<HTMLElement> {
		var htmlID=attribute.htmlID=this.nextID();
		var classNames="attribute";
		var readonly=false;

		var displayName=attribute.name;
		var displayValue=Xonomy.xmlEscape(attribute.value);
		var caption="";
		var title="";
		var spec=optionalParentName && this.docSpec.elements[optionalParentName]?.attributes?.[attribute.name];
		if(spec) {
			if(spec.displayName) displayName=this.textByLang(spec.displayName(attribute));
			if(spec.displayValue) displayValue=this.textByLang(spec.displayValue(attribute));
			if(spec.title) title=this.textByLang(spec.title(attribute));
			if(spec.caption) caption=this.textByLang(spec.caption(attribute));
			if(spec.isReadOnly && spec.isReadOnly(attribute)) { readonly=true; classNames+=" readonly"; }
			if(spec.isInvisible && spec.isInvisible(attribute)) { classNames+=" invisible"; }
			if(spec.shy && spec.shy(attribute)) { classNames+=" shy"; }
		}

		var isURL=displayValue.startsWith("https://") || displayValue.startsWith("http://");
		if (isURL) caption = `<a href="${displayValue}" target="${attribute.name}">🔗</a> ${caption}`;
		if(caption) caption = `<span class='inlinecaption'>${caption}</span>`;

		var $html=$(w`
			<span data-name="${attribute.name}" data-value="${Xonomy.xmlEscape(attribute.value)}" id="${htmlID}" class="${classNames}">
				<span class="punc">&nbsp;</span>
				<span class="warner"><span class="inside"></span></span>
				<span class="name attributeName focusable" title="${title}">${displayName}</span>
				<span class="punc">=</span>
				<span class="valueContainer attributeValue focusable">
					<span class="punc">"</span>
					${isURL ? `<span class="value" title="${displayValue}">URL</span>` : `<span class="value">${displayValue}</span>`}
					<span class="punc">"</span>
				</span>
				${caption}
			</span>
		`)
		$html.find('.warner').on('click', e => { this.click(htmlID, 'warner'); });
		if (!readonly) {
			// attach to element directly to avoid capturing bubbled events from descendant elements with an attribute
			$html.find('.attributeName').on('click',  e => { this.click(htmlID, 'attributeName'); });
			$html.find('.valueContainer').on('click', e => { this.click(htmlID, 'attributeValue'); });
		}
		
		return $html;
	}
	renderText(text: XonomyTextInstance): JQuery<HTMLElement> {
		var htmlID=text.htmlID=this.nextID();
		var classNames="textnode focusable";
		if($.trim(text.value)=="") classNames+=" whitespace";
		if(text.value=="") classNames+=" empty";
		
		var $html=$(w`
			<div id="${htmlID}" data-value="${Xonomy.xmlEscape(text.value)}" class="${classNames}">
				<span class="connector"></span>
				<span class="value">
					<span class="insertionPoint">
						<span class="inside"></span>
					</span>
					<span class="dots"></span>
					${/*text.value inserted here in js*/''}
				</span>
			</div>
		`);
		$html.find('.value').on('click', () => this.click(htmlID, 'text'));
		$html.find('.dots').after(this.chewText(text.value))
		return $html;
	}
	renderDisplayText(text: string, displayText: string): JQuery<HTMLElement> {
		var htmlID=this.nextID();
		var classNames="textnode";
		if($.trim(displayText)=="") classNames+=" whitespace";
		if(displayText=="") classNames+=" empty";
		const $html=$(`
			<div id="${htmlID}" data-value="${Xonomy.xmlEscape(text)}" class="${classNames}">
				<span class="connector"></span>
				<span class="value">
					<span class="insertionPoint">
						<span class="inside"></span>
					</span>
					<span class="dots"></span>${
					this.textByLang(displayText)
				}</span>
			</div>
		`)
		$html.find('.value').on('click', e => this.click(htmlID, 'text'));
		return $html;
	}
	/** wrap text in some html to render it in the editor as a text node */
	chewText(txt: string): JQuery<HTMLElement> {
		const self = this;
		let $elements = $();

		txt.split(' ').forEach((word, index) => {
			const $word = $(
			`<span data-index="${index}" data-word="${Xonomy.xmlEscape(word)}" class="word focusable">${Xonomy.xmlEscape(word)}</span>`)
			.on('click', function(event) {
				const isInlineMenu = $(this).closest('.element').hasClass('hasInlineMenu');
				if (isInlineMenu && (event.ctrlKey || event.metaKey)) {
					self.wordClick(this, );
				}
			});
			if (index > 0) $elements = $elements.add(document.createTextNode(" ")); // space between words
			$elements = $elements.add($word);
		});

		return $elements;
	}
	/** @param c the span where the textnode is rendered in the editor */
	wordClick(c: HTMLElement) {
		const $word = $(c);
		const $element = $(c).closest(".element");
		const isReadOnly = $word.closest(".readonly").length > 0;
		const htmlID = $element.attr("id")!;
		this.clickoff();
		
		
		if(!isReadOnly) {
			this.notclick = true;
			var content = this.inlineMenu(htmlID); //compose bubble content
			this.wrapIndex = $word.data('index');
			this.wrapWord = $word.data('word');
			if(content) {
				this.makeBubble(content).appendTo(this.$div); //create bubble
				this.showBubble($word); //anchor bubble to the word
			}
		}
	}
	/** Wrap the word in some xml. Assumes wordClick() has been called before this is called. So 1. wordClick() 2. wrap() */
	wrap(htmlID: string, param: {template: string, placeholder: string}) {
		const self = this;
		const jsElement = self.harvestElement(document.getElementById(htmlID)!);
		const oldText = jsElement.getText();
		const words = oldText.split(' ');
		

		this.clickoff();
		this.destroyBubble();
		
		
		if ($('#'+htmlID+' .children .element').length > 0) {
			$('#'+htmlID+' .children .element').each(function() {
				self.unwrap(this.id);
			});
			self.wrapIndex = words.indexOf(self.wrapWord!);
		}

		let $output = $();
		if (this.wrapIndex && this.wrapIndex > 0) {
			const theWord = words[this.wrapIndex];
			const xml = param.template.replace(param.placeholder, theWord)

			const $before = this.renderText(new XonomyTextInstance(words.slice(0, this.wrapIndex).join(" ")));
			const $wrapped = this.renderElement(this.xml2js(xml, jsElement));
			const $after = this.renderText(new XonomyTextInstance(words.slice(this.wrapIndex+1).join(" ")));

			$output = $before.append(document.createTextNode(" ")).append($wrapped).append(document.createTextNode(" ")).append($after);
			const newID = $wrapped.data('id')!;
			window.setTimeout(() => this.setFocus(newID, "openingTagName"), 100);
		} else {
			const xml = param.template.replace(param.placeholder, oldText)
			const js = this.xml2js(xml, jsElement);
			$output = this.renderElement(js);
		}
		$('#'+htmlID+' .children div').replaceWith($output);
		this.wrapIndex = null;
		this.wrapWord = null;
		this.changed();
	}
	/** remove an element node and replace it with its children */
	unwrap(htmlID: string) {
		const self = this;
		var parentID= $("#"+htmlID).parent().closest('.element').data().id;
		this.clickoff();
		var jsElement=this.harvestElement(document.getElementById(htmlID)!);
		$("#"+htmlID).replaceWith(this.renderText(new XonomyTextInstance(" " + jsElement.getText() + " ")));
		this.changed();
		window.setTimeout(function(){ self.setFocus(parentID, "openingTagName");  }, 100);
	}
	/** collapse/expand an xml node */
	plusminus(htmlID: string, forceExpand?: boolean) {
		const self = this;
		var $element=$("#"+htmlID);
		var $children=$element.children(".children");
		if($element.hasClass("collapsed")) {
			$children.hide();
			$element.removeClass("collapsed");
			if($element.hasClass("oneliner")) $children.fadeIn("fast"); else $children.slideDown("fast");
		} else if(!forceExpand) {
			self.updateCollapsoid(htmlID);
			if($element.hasClass("oneliner")) $children.fadeOut("fast", function(){ $element.addClass("collapsed"); });
			else $children.slideUp("fast", function(){ $element.addClass("collapsed"); });
		}
		window.setTimeout(function(){
			if($("#"+self.currentHtmlId+" .opening:visible").length>0) {
				self.setFocus(self.currentHtmlId!, "openingTagName");
			} else {
				self.setFocus(self.currentHtmlId!, "childrenCollapsed");
			}
		}, 300);
	}
	/** update the small preview that is displayed for collapsed elements */
	updateCollapsoid(htmlID: string) {
		const self = this;
		var $element=$("#"+htmlID);
		var whisper="";
		var elementName=$element.data("name");
		var spec=this.docSpec.elements[elementName];
		if(spec.collapsoid) {
			whisper=spec.collapsoid(this.harvestElement($element.toArray()[0]));
		} else {
			var abbreviated=false;
			$element.find(".textnode").each(function(){
				var txt=self.harvestText(this).value;
				for(var i=0; i<txt.length; i++) {
					if(whisper.length<35) whisper+=txt[i]; else abbreviated=true;
				}
				whisper+=" ";
			});
			whisper=whisper.replace(/  +/g, " ").replace(/ +$/g, "");
			if(abbreviated && !$element.hasClass("oneliner") && whisper!="...") whisper+="...";
		}
		if(whisper=="" || !whisper) whisper="...";
		$element.children(".childrenCollapsed").html(whisper);
	}


	click(htmlID: string, what: XonomyWhat) {
		const self = this;
		if(!this.notclick) {
			this.clickoff();
			this.lastClickWhat=what;
			this.currentHtmlId=htmlID;
			this.currentFocus=what;
			var isReadOnly=( $("#"+htmlID).hasClass("readonly") || $("#"+htmlID).closest(".readonly").toArray().length>0 );
			if(!isReadOnly && (what=="openingTagName" || what=="closingTagName") ) {
				$("#"+htmlID).addClass("current"); //make the element current
				const content=this.elementMenu(htmlID); //compose bubble content
				if(content) {
					this.makeBubble(content).appendTo(this.$div); //create bubble
					if(what=="openingTagName") this.showBubble($("#"+htmlID+" > .tag.opening > .name")); //anchor bubble to opening tag
					if(what=="closingTagName") this.showBubble($("#"+htmlID+" > .tag.closing > .name")); //anchor bubble to closing tag
				}
				var surrogateElem = this.harvestElement(document.getElementById(htmlID)!);
				$("#"+htmlID).trigger("xonomy-click-element", [surrogateElem]);
			}
			if(!isReadOnly && what=="attributeName") {
				$("#"+htmlID).addClass("current"); //make the attribute current
				const content = this.attributeMenu(htmlID); //compose bubble content
				if(content) {
					this.makeBubble(content).appendTo(this.$div); //create bubble
					this.showBubble($("#"+htmlID+" > .name")); //anchor bubble to attribute name
				}
				var surrogateAttr = this.harvestAttribute(document.getElementById(htmlID)!);
				$("#"+htmlID).trigger("xonomy-click-attribute", [surrogateAttr]);
			}
			if(!isReadOnly && what=="attributeValue") {
				$("#"+htmlID+" > .valueContainer").addClass("current"); //make attribute value current
				var name=$("#"+htmlID).attr("data-name")!; //obtain attribute's name
				var value=$("#"+htmlID).attr("data-value")!; //obtain current value
				var elName=$("#"+htmlID).closest(".element").attr("data-name")!;
				this.verifyDocSpecAttribute(elName, name);
				const spec=this.docSpec.elements[elName].attributes[name];
				let content = spec.asker.apply(this, [value, spec.askerParameter, this.harvestAttribute(document.getElementById(htmlID)!)]); //compose bubble content
				if (typeof content === 'string') content = $(content);
				if(content) {
					this.makeBubble(content).appendTo(this.$div); //create bubble
					this.showBubble($("#"+htmlID+" > .valueContainer > .value")); //anchor bubble to value
					this.answer=function(val: string) {
						var obj=document.getElementById(htmlID)!;
						var $html=this.renderAttribute(new XonomyAttributeInstance(name, val), elName);
						$(obj).replaceWith($html);
						this.changed();
						window.setTimeout(function(){self.clickoff(); self.setFocus($html.prop("id"), what)}, 100);
					};
				}
			}
			if(!isReadOnly && what=="text") {
				$("#"+htmlID).addClass("current");
				var value=$("#"+htmlID).attr("data-value")!; //obtain current value
				var elName=$("#"+htmlID).closest(".element").attr("data-name")!;
				const spec=this.docSpec.elements[elName];
				const jsEl = this.harvestText(document.getElementById(htmlID)!);
				
				let content = spec.asker.apply(this, [value, spec.askerParameter, jsEl]);
				if (typeof content === 'string') content = $(content);
				if(content) {
					this.makeBubble(content).appendTo(this.$div); //create bubble
					this.showBubble($("#"+htmlID+" > .value")); //anchor bubble to value
					this.answer=function(val: string) {
						var obj=document.getElementById(htmlID)!;
						var jsText = new XonomyTextInstance(val);
						var html=this.renderText(jsText);
						$(obj).replaceWith(html);
						this.changed(this.harvestText(document.getElementById(jsText.htmlID!)!));
						window.setTimeout(function(){self.clickoff(); self.setFocus($(html).prop("id"), what)}, 100);
					};
				}
			}
			if(what=="warner") {
				//$("#"+htmlID).addClass("current");
				let content=""; //compose bubble content
				for(var iWarning=0; iWarning<this.warnings.length; iWarning++) {
					var warning=this.warnings[iWarning];
					if(warning.htmlID==htmlID) {
						content+="<div class='warning'>"+Xonomy.formatCaption(this.textByLang(warning.text))+"</div>";
					}
				}
				this.makeBubble($(content)).appendTo(this.$div); //create bubble
				this.showBubble($("#"+htmlID+" .warner .inside").first()); //anchor bubble to warner
			}
			if(what=="rollouter" && $("#"+htmlID+" > .tag.opening > .attributes").children(".shy").toArray().length>0) {
				if( $("#"+htmlID).children(".tag.opening").children(".rollouter").hasClass("rolledout") ) {
					$("#"+htmlID).children(".tag.opening").children(".rollouter").removeClass("rolledout");
					$("#"+htmlID).children(".tag.opening").children(".attributes").slideUp("fast", function(){
						$(this).removeClass("rolledout").css("display", "");
					})
				} else {
					$("#"+htmlID).children(".tag.opening").children(".rollouter").addClass("rolledout");
					$("#"+htmlID).children(".tag.opening").children(".attributes").addClass("rolledout").hide().slideDown("fast");
				}
				window.setTimeout(function(){self.setFocus(htmlID, "rollouter")}, 100);
			}
			this.notclick=true;
		}
	}

	clickoff(ev?: JQuery.ClickEvent) { //event handler for the document-wide click-off event.
		if(!this.notclick) {
			this.currentHtmlId=null;
			this.currentFocus=null;
			this.destroyBubble();
			this.$div.find(".current").removeClass("current");
			this.$div.find(".focused").removeClass("focused");
		}
		this.notclick=false;
	}

	destroyBubble() {
		const bubble = this.$div.find(".xonomyBubble");
		if (bubble.length) {
			bubble.find(":focus").blur();
			bubble.remove();
			if(this.keyboardEventCatcher) this.keyboardEventCatcher.focus();
		}
	}
	makeBubble(content: JQuery<HTMLElement>) {
		this.destroyBubble();
		const $bubble = $(w`
		<div class="${this.mode} xonomyBubble">
			<div class='inside'>
				<div class='xonomyBubbleContent'></div>
			</div>
		</div>`)
		.on('click', () => this.notclick = true)
		$bubble.find('.xonomyBubbleContent').append(content);
		return $bubble;
	}
	showBubble($anchor: JQuery<Element>) {
		const self = this;
		var $bubble=this.$div.find(".xonomyBubble");

		let offset = $anchor.offset()!
		// offset is in document-space (i.e. relative to the 0,0 point of document.)
		// but sometimes document (0,0) is not at the top left corner of the window, such as when scrolled down on the page (it'll be at (0, -100) for example when scrolled 100px down)
		// so do this to transform the offset into screenspace (i.e. actual pixels from the top-left of the user's browser screen)
		offset = { 
			top: offset.top - $(window).scrollTop()!,
			left: offset.left - $(window).scrollLeft()!
		}

		var screenWidth = $(window).width()!;
		var screenHeight = $(window).height()!;
		
		var bubbleHeight = $bubble.outerHeight()!;
		var width = $anchor.width()!; if (width > 40) width = 40;
		var height = $anchor.height()!; if (height > 25) height = 25;
		if (this.mode == "laic") { width = width - 25; height = height + 10; }

		function verticalPlacement(): {top: string, bottom:string, left?: string, right?: string} {
			var top = "";
			var bottom = "";
			if (offset.top + height + bubbleHeight <= screenHeight) {
				// enough space - open down
				top = (offset.top + height) + "px";
			} else if (screenHeight - offset.top + 5 + bubbleHeight > 0) {
				// 5px above for some padding. Anchor using bottom so animation opens upwards.
				bottom = (screenHeight - offset.top + 5) + "px";
			} else {
				// neither downwards nor upwards is enough space => center the bubble
				top = (screenHeight - bubbleHeight)/2 + "px";
			}
			return { top: top, bottom: bottom };
		}

		var placement = verticalPlacement();
		if(offset.left<screenWidth/2) {
			placement.left = (offset.left + width - 15) + "px";
		} else {
			$bubble.addClass("rightAnchored");
			placement.right = (screenWidth - offset.left) + "px";
		}
		$bubble.css(placement);
		$bubble.slideDown("fast", function() {
			if(self.keyNav) $bubble.find(".focusme").first().focus(); //if the context menu contains anything with the class name 'focusme', focus it.
			else $bubble.find("input.focusme, select.focusme, textarea.focusme").first().focus();
		});

		$bubble.on("keyup", function(event){
			if(event.which==27) self.destroyBubble();
		});

		if(this.keyNav) {
			$bubble.find("div.focusme").on("keydown", function(event){
				if(event.which==40) { //down key
					var $item=$(event.delegateTarget);
					var $items=$bubble.find(".focusme:visible");
					var $next=$items.eq( $items.index($item[0])+1 );
					$next.focus();
					event.stopPropagation()
					event.preventDefault()
				}
				if(event.which==38) { //up key
					var $item=$(event.delegateTarget);
					var $items=$bubble.find("div.focusme:visible");
					var $next=$items.eq( $items.index($item[0])-1 );
					$next.focus();
					event.stopPropagation()
					event.preventDefault()
				}
				if(event.which==13) { //enter key
					$(event.delegateTarget).click();
					self.notclick=false;
					event.stopPropagation()
					event.preventDefault()
				}
			});
		}
	}
	/** Return html-as-string that contains a form that when submitted calls the this.answer function */
	askString(defaultString: string, askerParameter: any, jsMe: XonomyElementInstance|XonomyTextInstance|XonomyAttributeInstance): JQuery<HTMLElement> {
		var width=($("body").width()!*.5)-75
		const self = this;
		const $html = $(w`
		<form>
			<input name='val' class='textbox focusme' style='width: ${width}px;' value='${Xonomy.xmlEscape(defaultString)}'>
			<input type='submit' value='OK'>
		</form>`);

		$html.on('submit', function() { self.answer!((this as HTMLFormElement).val.value); return false; })
		$html.find('.textbox').on('keyup', () => this.notKeyUp=true);
		return $html;
	}
	askLongString(defaultString: string, askerParameter?: any, jsMe?: XonomyElementInstance|XonomyTextInstance|XonomyAttributeInstance): JQuery<HTMLElement> {
		var width=($("body").width()!*.5)-75
		const self = this;
		return $(w`
		<form>
			<textarea name='val' class='textbox focusme' spellcheck='false' style='width: ${width}px; height: 150px;'>${Xonomy.xmlEscape(defaultString)}</textarea>
			<div class='submitline'><input type='submit' value='OK'></div>
		</form>`)
		.on('submit', function() {self.answer!((this as HTMLFormElement).val.value); return false;})
	}
	askPicklist(defaultString: string, picklist: XonomyPickListOption[], jsMe: XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance): JQuery<HTMLElement> {
		return this.pickerMenu(picklist, defaultString);
	}
	/** open-ended picklist */
	askOpenPicklist(defaultString: string, picklist: XonomyPickListOption[]): JQuery<HTMLElement> {
		var isInPicklist=false;
		const self = this;
		const $html = this.pickerMenu(picklist, defaultString).add(w`
		<form class='undermenu'>
			<input name='val' class='textbox focusme' value='${!isInPicklist ? Xonomy.xmlEscape(defaultString) : ""}'>
			<input type='submit' value='OK'>
		</form>`);
		$html.find('form').on('submit', function() { self.answer!((this as HTMLFormElement).val.value); return false; })
		$html.find('input.textbox').on('keyup', () => this.notKeyUp=true);
		return $html;
	}


	askRemote(defaultString: string, param: {add?: XonomyPickListOption[], url: string, searchUrl: string, urlPlaceholder: string, createUrl: string}, jsMe: XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance): JQuery<HTMLElement> {
		let $html = $();
		
		if (param.searchUrl || param.createUrl) {
			const $form = $(w`
			<form class='overmenu'>
				<input name='val' class='textbox focusme' value=''/>
				${param.searchUrl ? `<button class='buttonSearch'>&nbsp;</button>` : ''}
				${param.createUrl ? `<button class='buttonCreate'>&nbsp;</button>` : ''}
			</form>`);

			$form.on('submit', () => this.remoteSearch(param.searchUrl, param.urlPlaceholder, defaultString))
			$form.find('.buttonSearch').on('click', () => this.remoteSearch(param.searchUrl, param.urlPlaceholder, defaultString))
			$form.find('.buttonCreate').on('click', () => this.remoteCreate(param.createUrl, param.searchUrl?param.searchUrl:param.url, param.urlPlaceholder, defaultString))
			$html = $html.add($form);
		}

		const $wyc = this.wyc<XonomyPickListOption[]>(param.url, items => {
			if (param.add) items.push(...param.add)
			return this.pickerMenu(items, defaultString)
		})
		$html = $html.add($wyc);
		this.lastAskerParam = param;
		return $html;
	}

	remoteSearch(searchUrl: string, urlPlaceholder: string, defaultString: string){
		const self = this;
		var text=this.$div.find(".xonomyBubble input.textbox").val() as string;
		searchUrl=searchUrl.replace(urlPlaceholder, encodeURIComponent(text));
		this.$div.find(".xonomyBubble .menu").replaceWith( this.wyc(searchUrl, function(picklist: XonomyPickListOption[]){
			var items=[];
			if(text=="" && self.lastAskerParam.add) for(var i=0; i<self.lastAskerParam.add.length; i++) items.push(self.lastAskerParam.add[i]);
			for(var i=0; i<picklist.length; i++) items.push(picklist[i]);
			return self.pickerMenu(items, defaultString);
		}));
		return false;
	}
	remoteCreate(createUrl: string, searchUrl: string, urlPlaceholder: string, defaultString: string){
		const self = this;
		var text=$.trim(this.$div.find(".xonomyBubble input.textbox").val() as string);
		if(text!="") {
			createUrl=createUrl.replace(urlPlaceholder, encodeURIComponent(text));
			searchUrl=searchUrl.replace(urlPlaceholder, encodeURIComponent(text));
			$.ajax({url: createUrl, dataType: "text", method: "POST"}).done(function(data){
				if(self.wycCache[searchUrl]) delete self.wycCache[searchUrl];
				self.$div.find(".xonomyBubble .menu").replaceWith( self.wyc(searchUrl, function(picklist: XonomyPickListOption[]){ return self.pickerMenu(picklist, defaultString); }) );
			});
		}
		return false;
	}
	pickerMenu(picklist: XonomyPickListOption[], defaultString: string): JQuery<HTMLElement> {
		const $html = $(`<div class="menu"></div>`)
		for(let _item of picklist) {
			const item = typeof _item === 'string' ? {value: _item, caption: ''} : _item;
			$(w`
				<div class='menuItem focusme techno${item.value==defaultString?" current":""}' tabindex='1'>
					<span class='punc'>"</span>
					${item.displayValue ? this.textByLang(item.displayValue) : Xonomy.xmlEscape(item.value) }
					<span class='punc'>"</span>
					${item.caption ? `<span class='explainer ${!item.displayValue && !item.value ? 'alone' : ''}'>${Xonomy.xmlEscape(this.textByLang(item.caption))}</span>` : ''}
				</div>
			`)
			.on('click', () => this.answer!(Xonomy.xmlEscape(item.value)))
			.appendTo($html)
		}
		
		return $html;
	}

	wyc<T>(url: string, callback: (v: T) => JQuery<HTMLElement>): JQuery<HTMLElement> { //a "when-you-can" function for delayed rendering: gets json from url, passes it to callback, and delayed-returns html-as-string from callback
		const self = this;
		this.wycLastID++;
		var wycID="xonomy_wyc_"+this.wycLastID;
		if(this.wycCache[url]) return callback(this.wycCache[url]);
		$.ajax({url: url, dataType: "json", method: "POST"}).done(function(data: T){
			$("#"+wycID).replaceWith(callback(data));
			self.wycCache[url]=data;
		});
		return $("<span class='wyc' id='"+wycID+"'></span>");
	}

	toggleSubmenu(menuItem: HTMLElement){
		var $menuItem=$(menuItem);
		if($menuItem.hasClass("expanded")){ $menuItem.find(".submenu").first().slideUp("fast", function(){$menuItem.removeClass("expanded");}); }
		else { $menuItem.find(".submenu").first().slideDown("fast", function(){$menuItem.addClass("expanded");}); };
	}
	/**
	 * @param items menu options
	 * @param jsMe the element for which to render the menu
	 * @param isSubMenu is the menu a section inside another parent menu
	 */
	internalMenu(items: XonomyMenuAction[], jsMe: XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance, isSubMenu = false): JQuery<HTMLElement>|undefined {
		this.harvestCache={};
		const self = this;
		
		const $items = items.map(item => {
			Xonomy.verifyDocSpecMenuItem(item);
			if (item.hideIf(jsMe)) return undefined;
			if (item.menu) { // render submenu
				const $subMenu =  this.internalMenu(item.menu, jsMe, true);
				if (!$subMenu) return undefined;
				const $menu = $(w`
				<div class='menuItem ${item.expanded(jsMe)?"expanded":""}'>
					<div class='menuLabel focusme' tabindex='0'>
						${item.icon ? "<span class='icon'><img src='"+item.icon+"'/></span> " : ""}
						${Xonomy.formatCaption(this.textByLang(item.caption(jsMe)))}
					</div>
				</div>`);

				$menu.on('keydown', function(event) { if(self.keyNav && [37, 39].indexOf(event.which)>-1) self.toggleSubmenu(this.parentElement!) })
				$menu.find('.menuLabel').on('click', function(event) { self.toggleSubmenu(this.parentElement!) })
				$menu.append($subMenu);
				return $menu;
			} else {
				return $(w`
				<div class='menuItem focusme' tabindex='0'>
					${item.keyTrigger && item.keyCaption ? "<span class='keyCaption'>"+this.textByLang(item.keyCaption)+"</span>" : ""}
					${item.icon ? "<span class='icon'><img src='"+item.icon+"'/></span> " : ""}
					${Xonomy.formatCaption(this.textByLang(item.caption(jsMe)))}
				</div>
				`)
				.on('click', () => this.callMenuFunction(item, jsMe.htmlID!));
			}
		})
		.filter(item => item) as JQuery[]

		return $items.length ? $(`<div class="${isSubMenu ? 'submenu' : 'menu'}"></div>`).append($items) : undefined;
	}
	attributeMenu(htmlID: string): JQuery<HTMLElement>|undefined {
		this.harvestCache={};
		var name=$("#"+htmlID).attr("data-name")!; //obtain attribute's name
		var elName=$("#"+htmlID).closest(".element").attr("data-name")!; //obtain element's name
		this.verifyDocSpecAttribute(elName, name);
		var spec=this.docSpec.elements[elName].attributes[name];
		return this.internalMenu(spec.menu, this.harvestAttribute(document.getElementById(htmlID)!));
	}
	elementMenu(htmlID: string): JQuery<HTMLElement>|undefined {
		this.harvestCache={};
		var elName=$("#"+htmlID).attr("data-name")!; //obtain element's name
		var spec=this.docSpec.elements[elName];
		return this.internalMenu(spec.menu, this.harvestElement(document.getElementById(htmlID)!));
	}
	inlineMenu(htmlID: string): JQuery<HTMLElement>|undefined {
		this.harvestCache={};
		var elName=$("#"+htmlID).attr("data-name")!; //obtain element's name
		var spec=this.docSpec.elements[elName];
		return this.internalMenu(spec.inlineMenu, this.harvestElement(document.getElementById(htmlID)!));
	}
	callMenuFunction(menuItem: XonomyMenuAction, htmlID: string) {
		menuItem.action.apply(this, [htmlID, menuItem.actionParameter]);
	}
	static formatCaption(caption: string) {
		caption=caption.replace(/\<(\/?)([^\>\/]+)(\/?)\>/g, "<span class='techno'><span class='punc'>&lt;$1</span><span class='elName'>$2</span><span class='punc'>$3&gt;</span></span>");
		caption=caption.replace(/\@"([^\"]+)"/g, "<span class='techno'><span class='punc'>\"</span><span class='atValue'>$1</span><span class='punc'>\"</span></span>");
		caption=caption.replace(/\@([^ =]+)=""/g, "<span class='techno'><span class='atName'>$1</span><span class='punc'>=\"</span><span class='punc'>\"</span></span>");
		caption=caption.replace(/\@([^ =]+)="([^\"]+)"/g, "<span class='techno'><span class='atName'>$1</span><span class='punc'>=\"</span><span class='atValue'>$2</span><span class='punc'>\"</span></span>");
		caption=caption.replace(/\@([^ =]+)/g, "<span class='techno'><span class='atName'>$1</span></span>");
		return caption;
	}

	deleteAttribute(htmlID: string, parameter: any) {
		this.clickoff();
		var obj=document.getElementById(htmlID)!;
		var parentID=obj.parentElement!.parentElement!.parentElement!.id;
		obj.parentElement!.removeChild(obj);
		this.changed();
		window.setTimeout(() => this.setFocus(parentID, "openingTagName"), 100);
	}
	deleteElement(htmlID: string, parameter: any) {
		this.clickoff();
		var obj=document.getElementById(htmlID)!;
		var parentID=obj.parentElement!.parentElement!.id;
		$(obj).fadeOut(() => {
			var parentNode=obj.parentElement!;
			parentNode.removeChild(obj);
			this.changed();
			if($(parentNode).closest(".layby").length==0) {
				window.setTimeout(() => this.setFocus(parentID, "openingTagName"), 100);
			}
		});
	}
	newAttribute(htmlID: string, parameter: {name: string, value: string}) {
		this.clickoff();
		var $element=$("#"+htmlID);
		var $html=this.renderAttribute(new XonomyAttributeInstance(parameter.name, parameter.value), $element.data("name"));
		$("#"+htmlID+" > .tag.opening > .attributes").append($html);
		this.changed();
		//if the attribute we have just added is shy, force rollout:
		if($("#"+htmlID+" > .tag.opening > .attributes").children("[data-name='"+parameter.name+"'].shy").toArray().length>0) {
			if( !$("#"+htmlID).children(".tag.opening").children(".rollouter").hasClass("rolledout") ) {
				$("#"+htmlID).children(".tag.opening").children(".rollouter").addClass("rolledout");
				$("#"+htmlID).children(".tag.opening").children(".attributes").addClass("rolledout").hide().slideDown("fast");
			}
		}
		if(parameter.value=="") this.click($html.prop("id"), "attributeValue"); else this.setFocus($html.prop("id"), "attributeValue");
	}
	newElementChild(htmlID: string, parameter: string|Document) {
		this.clickoff();
		var jsElement=this.harvestElement(document.getElementById(htmlID)!);
		var $html=this.renderElement(this.xml2js(parameter, jsElement)).hide();
		$("#"+htmlID+" > .children").append($html);
		this.plusminus(htmlID, true);
		this.elementReorder($html.attr("id")!);
		this.changed();
		$html.fadeIn();
		window.setTimeout(() => this.setFocus($html.prop("id"), "openingTagName"), 100);
	}
	elementReorder(htmlID: string){
		var that=document.getElementById(htmlID)!;
		var elSpec=this.docSpec.elements[that.getAttribute("data-name")!];
		if(elSpec.mustBeBefore) { //is it after an element it cannot be after? then move it up until it's not!
			var $this=$(that);
			var jsElement=this.harvestElement(that);
			var mustBeBefore=elSpec.mustBeBefore(jsElement);
			var ok; do {
				ok=true;
				for(var ii=0; ii<mustBeBefore.length; ii++) {
					if( $this.prevAll("*[data-name='"+mustBeBefore[ii]+"']").toArray().length>0 ) {
						$this.prev().before($this);
						ok=false;
					}
				}
			} while(!ok)
		}
		if(elSpec.mustBeAfter) { //is it before an element it cannot be before? then move it down until it's not!
			var $this=$(that);
			var jsElement=this.harvestElement(that);
			var mustBeAfter=elSpec.mustBeAfter(jsElement);
			var ok; do {
				ok=true;
				for(var ii=0; ii<mustBeAfter.length; ii++) {
					if( $this.nextAll("*[data-name='"+mustBeAfter[ii]+"']").toArray().length>0 ) {
						$this.next().after($this);
						ok=false;
					}
				}
			} while(!ok)
		}
	}
	newElementBefore(htmlID: string, parameter: string|Document) {
		this.clickoff();
		var jsElement=this.harvestElement(document.getElementById(htmlID)!);
		var $html=this.renderElement(this.xml2js(parameter, jsElement.parent())).hide();
		$("#"+htmlID).before($html);
		this.elementReorder($html.prop("id"));
		this.changed();
		$html.fadeIn();
		window.setTimeout(() => this.setFocus($html.prop("id"), "openingTagName"), 100);
	}
	newElementAfter(htmlID: string, parameter: string|Document) {
		this.clickoff();
		var jsElement=this.harvestElement(document.getElementById(htmlID)!);
		var $html=this.renderElement(this.xml2js(parameter, jsElement.parent())).hide();
		$("#"+htmlID).after($html);
		this.elementReorder($html.prop("id"));
		this.changed();
		$html.fadeIn();
		window.setTimeout(() => this.setFocus($html.prop("id"), "openingTagName"), 100);
	}
	replace(htmlID: string, jsNode: XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance) {
		var what=this.currentFocus!;
		this.clickoff();
		var $html = $();
		if(jsNode.type=="element") $html=this.renderElement(jsNode);
		if(jsNode.type=="attribute") $html=this.renderAttribute(jsNode);
		if(jsNode.type=="text") $html=this.renderText(jsNode);
		$("#"+htmlID).replaceWith($html);
		this.changed();
		window.setTimeout(() => this.setFocus($html.prop("id"), what), 100);
	}
	// TODO document this
	editRaw(htmlID: string, parameter: {
		fromJs(inst: XonomyElementInstance): string, 
		fromXml(xml: string): string
		toJs(val: string, jsElement: XonomyElementInstance): XonomyElementInstance,
		toXml(val: string, jsElement: XonomyElementInstance): string
	}) {
		var div=document.getElementById(htmlID)!;
		var jsElement: XonomyElementInstance=this.harvestElement(div);
		if(parameter.fromJs) var txt=parameter.fromJs( jsElement );
		else if(parameter.fromXml) var txt=parameter.fromXml( this.js2xml(jsElement) );
		else var txt=this.js2xml(jsElement);
		this.makeBubble(this.askLongString(txt)).appendTo(this.$div); //create bubble
		this.showBubble($(div)); //anchor bubble to element
		this.answer=function(val: string) {
			var jsNewElement;
			if(parameter.toJs) jsNewElement=parameter.toJs(val, jsElement);
			else if(parameter.toXml) jsNewElement=this.xml2js(parameter.toXml(val, jsElement), jsElement.parent());
			else jsNewElement=this.xml2js(val, jsElement.parent());

			var obj=document.getElementById(htmlID)!;
			var $html=this.renderElement(jsNewElement);
			$(obj).replaceWith($html);
			this.clickoff();
			this.changed();
			window.setTimeout(() => this.setFocus($html.prop("id"), "openingTagName"), 100);
		};
	}
	duplicateElement(htmlID: string) {
		this.clickoff();
		const original = document.getElementById(htmlID)!;
		const clone = this.renderElement(this.harvestElement(original));
		clone.hide();
		clone.insertAfter(original)
		this.changed();
		clone.fadeIn();
		window.setTimeout(() => this.setFocus(clone.prop("id"), "openingTagName"), 100);
	}
	moveElementUp(htmlID: string){
		this.clickoff();
		var $me=$("#"+htmlID);
		if($me.closest(".layby > .content").length==0) {
			this.insertDropTargets(htmlID);
			var $droppers=this.$div.find(".elementDropper").add($me);
			var i=$droppers.index($me[0])-1;
			if(i>=0) {
				$($droppers[i]).replaceWith($me);
				this.changed();
				$me.hide().fadeIn();
			}
			this.dragend();
		}
		window.setTimeout(() => this.setFocus(htmlID, "openingTagName"), 100);
	}
	moveElementDown(htmlID: string){
		this.clickoff();
		var $me=$("#"+htmlID);
		if($me.closest(".layby > .content").length==0) {
			this.insertDropTargets(htmlID);
			var $droppers=this.$div.find(".elementDropper").add($me);
			var i=$droppers.index($me[0])+1;
			if(i<$droppers.length) {
				$($droppers[i]).replaceWith($me);
				this.changed();
				$me.hide().fadeIn();
			}
			this.dragend();
		}
		window.setTimeout(() => this.setFocus(htmlID, "openingTagName"), 100);
	}
	canMoveElementUp(htmlID: string){
		var ret=false;
		var $me=$("#"+htmlID);
		if($me.closest(".layby > .content").length==0) {
			this.insertDropTargets(htmlID);
			var $droppers=this.$div.find(".elementDropper").add($me);
			var i=$droppers.index($me[0])-1;
			if(i>=0) ret=true;
			this.dragend();
		}
		return ret;
	}
	canMoveElementDown(htmlID: string){
		var ret=false;
		var $me=$("#"+htmlID);
		if($me.closest(".layby > .content").length==0) {
			this.insertDropTargets(htmlID);
			var $droppers=this.$div.find(".elementDropper").add($me);
			var i=$droppers.index($me[0])+1;
			if(i<$droppers.length) ret=true;
			this.dragend();
		}
		return ret;
	}
	mergeWithPrevious(htmlID: string, parameter: any){
		var domDead=document.getElementById(htmlID)!;
		var elDead=this.harvestElement(domDead);
		var elLive=elDead.getPrecedingSibling();
		if (!elLive) return;
		this.mergeElements(elDead, elLive);
	}
	mergeWithNext(htmlID: string, parameter: any){
		var domDead=document.getElementById(htmlID)!;
		var elDead=this.harvestElement(domDead);
		var elLive=elDead.getFollowingSibling();
		if (!elLive) return;
		this.mergeElements(elDead, elLive);
	}
	mergeElements(elDead: XonomyElementInstance, elLive: XonomyElementInstance){
		this.clickoff();
		var domDead=document.getElementById(elDead.htmlID!)!;
		if(elLive && elLive.type=="element") {
			for(var i=0; i<elDead.attributes.length; i++){ //merge attributes
				var atDead=elDead.attributes[i];
				if(!elLive.hasAttribute(atDead.name) || elLive.getAttributeValue(atDead.name)==""){
					elLive.setAttribute(atDead.name, atDead.value);
					if(elLive.hasAttribute(atDead.name)) $("#"+elLive.getAttribute(atDead.name)!.htmlID).remove();
					$("#"+elLive.htmlID).find(".attributes").first().append($("#"+elDead.attributes[i].htmlID));
				}
			}
			var specDead=this.docSpec.elements[elDead.name];
			var specLive=this.docSpec.elements[elLive.name];
			if(specDead.hasText(elDead) || specLive.hasText(elLive)){ //if either element is meant to have text, concatenate their children
				if(elLive.getText()!="" && elDead.getText()!="") {
					elLive.addText(" ");
					$("#"+elLive.htmlID).find(".children").first().append(this.renderText(new XonomyTextInstance(" ")));
				}
				for(var i=0; i<elDead.children.length; i++) {
					elLive.children.push(elDead.children[i]);
					$("#"+elLive.htmlID).find(".children").first().append($("#"+elDead.children[i].htmlID));
				}
			} else { //if no text, merge their children one by one
				for(const cDead of elDead.children){
					var xmlDeadChild=this.js2xml(cDead);
					var has=false;
					for(const cLive of elLive.children){
						var xmlLiveChild=this.js2xml(cLive);
						if(xmlDeadChild==xmlLiveChild){ has=true; break; }
					}
					if(!has) {
						elLive.children.push(cDead);
						$("#"+elLive.htmlID).find(".children").first().append($("#"+cDead.htmlID));
						this.elementReorder(cDead.htmlID!);
					}
				}
			}
			domDead.parentElement!.removeChild(domDead);
			this.changed();
			window.setTimeout(() => this.setFocus(elLive.htmlID!, "openingTagName"), 100);
		} else {
			window.setTimeout(() => this.setFocus(elDead.htmlID!, "openingTagName"), 100);
		}
	}
	deleteEponymousSiblings(htmlID: string, parameter: any) {
		var what=this.currentFocus;
		this.clickoff();
		var obj=document.getElementById(htmlID)!;
		var parent=obj.parentElement!.parentElement!;
		var _htmlChildren=$(parent).children(".children").toArray()[0].children;
		var htmlChildren=[]; for(var i=0; i<_htmlChildren.length; i++) htmlChildren.push(_htmlChildren[i]);
		for(var i=0; i<htmlChildren.length; i++) {
			var htmlChild=htmlChildren[i];
			if($(htmlChild).hasClass("element")) {
				if($(htmlChild).attr("data-name")==$(obj).attr("data-name") && htmlChild!=obj){
					htmlChild.parentElement!.removeChild(htmlChild);
				}
			}
		}
		this.changed();
		window.setTimeout(() => this.setFocus(htmlID, what!), 100);
	}

	insertDropTargets(htmlID: string){
		const self = this;
		var $element=$("#"+htmlID);
		$element.addClass("dragging");
		var elementName=$element.attr("data-name")!;
		var elSpec=this.docSpec.elements[elementName];
		
		this.$div.find(".element:visible > .children").append("<div class='elementDropper'><div class='inside'></div></div>")
		this.$div.find(".element:visible > .children > .element").before("<div class='elementDropper'><div class='inside'></div></div>")
		this.$div.find(".element:visible > .children > .text").before("<div class='elementDropper'><div class='inside'></div></div>")
		this.$div.find('.elementDropper').on('dragover', event => this.dragOver(event.originalEvent!))
		this.$div.find('.elementDropper').on('dragleave', event => this.dragOut(event.originalEvent!))
		this.$div.find('.elementDropper').on('drop', event => this.drop(event.originalEvent!))
		
		this.$div.find(".dragging .children:visible > .elementDropper").remove(); //remove drop targets fom inside the element being dragged
		this.$div.find(".dragging").prev(".elementDropper").remove(); //remove drop targets from immediately before the element being dragged
		this.$div.find(".dragging").next(".elementDropper").remove(); //remove drop targets from immediately after the element being dragged
		this.$div.find(".children:visible > .element.readonly .elementDropper").remove(); //remove drop targets from inside read-only elements

		var harvestCache: Record<string, XonomyElementInstance>={};
		var harvestElement=function(div: HTMLElement){
			var htmlID=$(div).prop("id");
			if(!harvestCache[htmlID]) harvestCache[htmlID]=self.harvestElement(div);
			return harvestCache[htmlID];
		};

		if(elSpec.localDropOnly(harvestElement($element.toArray()[0]))) {
			if(elSpec.canDropTo) { //remove the drop target from elements that are not the dragged element's parent
				var droppers=this.$div.find(".elementDropper").toArray();
				for(var i=0; i<droppers.length; i++) {
					var dropper=droppers[i];
					if(dropper.parentNode!=$element.get(0).parentElement!.parentElement!.parentElement!) {
						dropper.parentElement!.removeChild(dropper);
					}
				}
			}
		}
		if(elSpec.canDropTo) { //remove the drop target from elements it cannot be dropped into
			var droppers=this.$div.find(".elementDropper").toArray();
			for(var i=0; i<droppers.length; i++) {
				var dropper=droppers[i];
				var parentElementName=dropper.parentElement!.parentElement!.getAttribute("data-name");
				if($.inArray(parentElementName, elSpec.canDropTo)<0) {
					dropper.parentElement!.removeChild(dropper);
				}
			}
		}
		if(elSpec.mustBeBefore) { //remove the drop target from after elements it cannot be after
			var jsElement=harvestElement($element.toArray()[0]);
			var droppers=this.$div.find(".elementDropper").toArray();
			for(var i=0; i<droppers.length; i++) {
				var dropper=droppers[i];
				jsElement.internalParent=harvestElement(dropper.parentElement!.parentElement!); //pretend the element's parent is the dropper's parent
				var mustBeBefore=elSpec.mustBeBefore(jsElement);
				for(var ii=0; ii<mustBeBefore.length; ii++) {
					if( $(dropper).prevAll("*[data-name='"+mustBeBefore[ii]+"']").toArray().length>0 ) {
						dropper.parentElement!.removeChild(dropper);
					}
				}
			}
		}
		if(elSpec.mustBeAfter) { //remove the drop target from before elements it cannot be before
			var jsElement=harvestElement($element.toArray()[0]);
			var droppers=this.$div.find(".elementDropper").toArray();
			for(var i=0; i<droppers.length; i++) {
				var dropper=droppers[i];
				jsElement.internalParent=harvestElement(dropper.parentElement!.parentElement!); //pretend the element's parent is the dropper's parent
				var mustBeAfter=elSpec.mustBeAfter(jsElement);
				for(var ii=0; ii<mustBeAfter.length; ii++) {
					if( $(dropper).nextAll("*[data-name='"+mustBeAfter[ii]+"']").toArray().length>0 ) {
						dropper.parentElement!.removeChild(dropper);
					}
				}
			}
		}
	}

	drag(ev: DragEvent) { //called when dragging starts
		// Wrapping all the code into a timeout handler is a workaround for a Chrome browser bug
		// (if the DOM is manipulated in the 'dragStart' event then 'dragEnd' event is sometimes fired immediately)
		//
		// for more details @see:
		//   http://stackoverflow.com/questions/19639969/html5-dragend-event-firing-immediately
		ev.dataTransfer!.effectAllowed="move"; //only allow moving (and not eg. copying)
		var htmlID=(ev.target as HTMLElement).parentElement!.parentElement!.id;
		ev.dataTransfer!.setData("text", htmlID);
		setTimeout(() => {
			this.clickoff();
			this.insertDropTargets(htmlID);
			this.draggingID=htmlID;
			this.refresh();
		}, 10);
	}
	dragOver(ev: DragEvent) {
		ev.preventDefault();
		ev.dataTransfer!.dropEffect="move"; //only allow moving (and not eg. copying]
		if($(ev.currentTarget!).hasClass("layby")){
			$(ev.currentTarget!).addClass("activeDropper");
		} else {
			$((ev.target as HTMLElement).parentElement!).addClass("activeDropper");
		}
	}
	dragOut(ev: DragEvent) {
		ev.preventDefault();
		if($(ev.currentTarget!).hasClass("layby")){
			$(ev.currentTarget!).removeClass("activeDropper");
		} else {
			this.$div.find(".activeDropper").removeClass("activeDropper");
		}
	}
	drop(ev: DragEvent) {
		ev.preventDefault();
		var node=document.getElementById(this.draggingID!)!; //the thing we are moving
		if($(ev.currentTarget!).hasClass("layby")) {
			$(node).hide();
			this.$div.find(".layby > .content").append(node);
			$(node).fadeIn(() => this.changed());
		} else {
			$(node).hide();
			$((ev.target as HTMLElement).parentElement!).replaceWith(node);
			$(node).fadeIn(() => this.changed());
		}
		this.openCloseLayby();
		this.recomputeLayby();
	}
	dragend(ev?: DragEvent) {
		this.$div.find(".attributeDropper").remove();
		this.$div.find(".elementDropper").remove();
		this.$div.find(".dragging").removeClass("dragging");
		this.refresh();
		this.$div.find(".layby").removeClass("activeDropper");
	}

	openCloseLayby(){ //open the layby if it's full, close it if it's empty
		if(this.$div.find(".layby > .content > *").length>0){
			this.$div.find(".layby").removeClass("closed").addClass("open");
		} else {
			this.$div.find(".layby").removeClass("open").addClass("closed");
		}
	}
	openLayby(){
		this.$div.find(".layby").removeClass("closed").addClass("open");
	}
	closeLayby(){
		window.setTimeout(() => this.$div.find(".layby").removeClass("open").addClass("closed"), 10);
	}
	emptyLayby(){
		this.$div.find(".layby .content").html("");
		this.$div.find(".layby").removeClass("nonempty").addClass("empty");
	}
	recomputeLayby(){
		if(this.$div.find(".layby > .content > *").length>0){
			this.$div.find(".layby").removeClass("empty").addClass("nonempty");
		} else {
			this.$div.find(".layby").removeClass("nonempty").addClass("empty");
		}
	}
	newElementLayby(xml: string|Document) {
		this.clickoff();
		var $html=this.renderElement(this.xml2js(xml)).hide();
		this.$div.find(".layby > .content").append($html);
		this.refresh();
		$html.fadeIn();
		this.openCloseLayby();
		this.recomputeLayby();
	}

	changed(jsElement?: XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance) { //called when the document changes
		this.harvestCache={};
		this.refresh();
		this.validate();
		this.docSpec.onchange(jsElement); //report that the document has changed
	}
	validate() {
		var js=this.harvestElement(this.$div.find(".element").toArray()[0]);
		this.$div.find(".invalid").removeClass("invalid");
		this.warnings=[];
		this.docSpec.validate(js); //validate the document
		for(var iWarning=0; iWarning<this.warnings.length; iWarning++) {
			var warning=this.warnings[iWarning];
			$("#"+warning.htmlID).addClass("invalid");
		}
	}


	textByLang(str: string) {
		//str = eg. "en: Delete | de: Löschen | fr: Supprimer"
		if(!str) str="";
		var ret=str;
		var segs=str.split("|");
		for(var i=0; i<segs.length; i++) {
			var seg=$.trim(segs[i]);
			if(seg.indexOf(this.lang+":")==0) {
				ret=seg.substring((this.lang+":").length, ret.length);
			}
		}
		ret=$.trim(ret);
		return ret;
	}


	startKeyNav(keyboardEventCatcher: string|HTMLElement, scrollableContainer: string|HTMLElement){
		const self = this;
		this.keyNav=true;
		var $keyboardEventCatcher=$(keyboardEventCatcher as any); if(!keyboardEventCatcher) $keyboardEventCatcher=this.$div;
		var $scrollableContainer=$(scrollableContainer as any); if(!scrollableContainer) $scrollableContainer=$keyboardEventCatcher;
		$keyboardEventCatcher.attr("tabindex", "0");
		$keyboardEventCatcher.on("keydown", e => self.key(e));
		$(document).on("keydown", function(e) { if([32, 37, 38, 39, 40].indexOf(e.keyCode)>-1 && self.$div.find("input:focus, select:focus, textarea:focus").length==0) e.preventDefault(); }); //prevent default browser scrolling on arrow keys
		this.keyboardEventCatcher=$keyboardEventCatcher;
		this.scrollableContainer=$scrollableContainer;
	}
	setFocus(htmlID: string, what: XonomyWhat){
		if(this.keyNav) {
			this.$div.find(".current").removeClass("current");
			this.$div.find(".focused").removeClass("focused");
			if(what=="attributeValue") $("#"+htmlID+" > .valueContainer").addClass("current").addClass("focused");
			else $("#"+htmlID).addClass("current").addClass("focused");
			this.currentHtmlId=htmlID;
			this.currentFocus=what;
			if(this.currentFocus=="openingTagName") $("#"+htmlID+" > .tag.opening").first().addClass("focused");
			if(this.currentFocus=="closingTagName") $("#"+htmlID+" > .tag.closing").last().addClass("focused");
			if(this.currentFocus=="childrenCollapsed") $("#"+htmlID+" > .childrenCollapsed").last().addClass("focused");
			if(this.currentFocus=="rollouter") $("#"+htmlID+" > .tag.opening > .rollouter").last().addClass("focused");
		}
	}
	key(event: JQuery.Event){
		if(!this.notKeyUp) {
			if(!event.shiftKey && !this.$div.find(".xonomyBubble").length ) {
				if(event.which==27) { //escape key
					event.preventDefault();
					event.stopImmediatePropagation();
					this.destroyBubble();
				} else if(event.which==13){ //enter key
					event.preventDefault();
					event.stopImmediatePropagation();
					if(this.currentFocus=="childrenCollapsed") this.plusminus(this.currentHtmlId!, true);
					else {
						this.click(this.currentHtmlId!, this.currentFocus!);
						this.clickoff();
					}
				} else if((event.ctrlKey || event.metaKey) && event.which==40) { //down key with Ctrl or Cmd (Mac OS)
					event.preventDefault();
					event.stopImmediatePropagation();
					this.scrollableContainer!.scrollTop( this.scrollableContainer!.scrollTop()!+60 );
				} else if((event.ctrlKey || event.metaKey) && event.which==38) { //up key with Ctrl or Cmd (Mac OS)
					event.preventDefault();
					event.stopImmediatePropagation();
					this.scrollableContainer!.scrollTop( this.scrollableContainer!.scrollTop()!-60 );
				} else if((event.ctrlKey || event.metaKey) && [37, 39].indexOf(event.which!)>-1) { //arrow keys with Ctrl or Cmd (Mac OS)
					event.preventDefault();
					event.stopImmediatePropagation();
					var $el=$("#"+this.currentHtmlId);
					if($el.hasClass("element") && !$el.hasClass("uncollapsible")){
						if(event.which==39 && $el.hasClass("collapsed")) { //expand it!
							this.plusminus(this.currentHtmlId!);
						}
						if(event.which==37 && !$el.hasClass("collapsed")) { //collapse it!
							this.plusminus(this.currentHtmlId!);
						}
					}
				} else if([37, 38, 39, 40].indexOf(event.which!)>-1 && !event.altKey) { //arrow keys
					event.preventDefault();
					event.stopImmediatePropagation();
					if(!this.currentHtmlId) { //nothing is current yet
						this.setFocus(this.$div.find(".element").first().prop("id"), "openingTagName");
					} else if(this.$div.find(".focused").length==0) { //something is current but nothing is focused yet
						this.setFocus(this.currentHtmlId, this.currentFocus!);
					} else { //something is current, do arrow action
						if(event.which==40) this.goDown(); //down key
						if(event.which==38) this.goUp(); //up key
						if(event.which==39) this.goRight(); //right key
						if(event.which==37) this.goLeft(); //left key
					}
				}
			} else if(!this.$div.find(".xonomyBubble").length) {
				this.keyboardMenu(event);
			} else {
				// There's an edit widget (xonomyBubble) open right now.
				if (event.which == 13 && event.ctrlKey) {
					// Ctrl+Enter submits.
					event.preventDefault();
					event.stopImmediatePropagation();
					this.$div.find(".xonomyBubble form").trigger('submit');
				}
			}
		}
		this.notKeyUp=false;
	}
	keyboardMenu(event: JQuery.Event){
		this.harvestCache={};
		var $obj=$("#"+this.currentHtmlId);
		var jsMe: null|XonomyElementInstance|XonomyAttributeInstance=null;
		var menu=null;
		if($obj.hasClass("element")){
			jsMe=this.harvestElement($obj[0]);
			var elName=$obj.attr("data-name")!;
			menu=this.docSpec.elements[elName].menu;
		} else if($obj.hasClass("attribute")) {
			jsMe=this.harvestAttribute($obj[0]);
			var atName=$obj.attr("data-name")!;
			var elName=$obj.closest(".element").attr("data-name")!;
			menu=this.docSpec.elements[elName].attributes[atName].menu;
		} 
		if(menu){
			this.harvestCache={};
			var findMenuItem=function(menu: XonomyMenuAction[]): null|XonomyMenuAction {
				var ret=null;
				for(const opt of menu){
					if(opt.menu) ret=findMenuItem(opt.menu);
					else if(opt.keyTrigger && !opt.hideIf(jsMe!) && opt.keyTrigger(event)) ret=opt;
					if(ret) break;
				}
				return ret;
			};
			var menuItem=findMenuItem(menu);
			if(menuItem) {
				this.callMenuFunction(menuItem, this.currentHtmlId!);
				this.clickoff();
				return true;
			}
		}
		return false;
	}

	goDown(){
		if(this.currentFocus!="openingTagName" && this.currentFocus!="closingTagName" && this.currentFocus!="text") {
			this.goRight();
		} else {
			var $el=$("#"+this.currentHtmlId);
			var $me=$el;
			if(this.currentFocus=="openingTagName") var $me=$el.find(".tag.opening").first();
			if(this.currentFocus=="closingTagName") var $me=$el.find(".tag.closing").last();

			var $candidates=this.$div.find(".focusable:visible").not(".attributeName").not(".attributeValue").not(".childrenCollapsed").not(".rollouter");
			$candidates=$candidates.add($el);
			if(this.currentFocus=="openingTagName" && $el.hasClass("oneliner")) $candidates=$candidates.not("#"+this.currentHtmlId+" .tag.closing").not("#"+this.currentHtmlId+" .children *");
			if(this.currentFocus=="openingTagName" && $el.hasClass("oneliner")) $candidates=$candidates.not("#"+this.currentHtmlId+" .textnode");
			if($el.hasClass("collapsed")) $candidates=$candidates.not("#"+this.currentHtmlId+" .tag.closing");
			if($el.hasClass("textnode") && this.$div.hasClass("nerd")) var $candidates=$el.closest(".element").find(".tag.closing").last();
			if($el.hasClass("textnode") && this.$div.hasClass("laic")) var $candidates=$el.closest(".element").next().find(".focusable:visible").first();

			var $next=$candidates.eq( $candidates.index($me[0])+1 );
			if($next.hasClass("opening")) this.setFocus($next.closest(".element").prop("id"), "openingTagName");
			if($next.hasClass("closing")) this.setFocus($next.closest(".element").prop("id"), "closingTagName");
			if($next.hasClass("textnode")) this.setFocus($next.prop("id"), "text");
		}
	}
	goUp(){
		if(this.currentFocus!="openingTagName" && this.currentFocus!="closingTagName" && this.currentFocus!="text") {
			this.goLeft();
		} else {
			var $el=$("#"+this.currentHtmlId);
			var $me=$el;
			if(this.currentFocus=="openingTagName") var $me=$el.find(".tag.opening").first();
			if(this.currentFocus=="closingTagName") var $me=$el.find(".tag.closing").last();

			var $candidates=this.$div.find(".focusable:visible").not(".attributeName").not(".attributeValue").not(".childrenCollapsed").not(".rollouter");
			$candidates=$candidates.not(".element .oneliner .tag.closing");
			$candidates=$candidates.not(".element .oneliner .textnode");
			$candidates=$candidates.not(".element .collapsed .tag.closing");
			if($el.hasClass("textnode")) var $candidates=$el.closest(".element").find(".tag.opening").first().add($el);
			if($me.hasClass("closing") && $el.hasClass("hasText")) $candidates=$candidates.not("#"+this.currentHtmlId+" .children *:not(:first-child)");
			if($me.hasClass("opening") && $el.closest(".element").prev().hasClass("hasText")) {
				var siblingID=$el.closest(".element").prev().prop("id");
				$candidates=$candidates.not("#"+siblingID+" .children *:not(:first-child)");
			}

			if($candidates.index($me[0])>0) {
				var $next=$candidates.eq( $candidates.index($me[0])-1 );
				if($next.hasClass("opening")) this.setFocus($next.closest(".element").prop("id"), "openingTagName");
				if($next.hasClass("closing")) this.setFocus($next.closest(".element").prop("id"), "closingTagName");
				if($next.hasClass("textnode")) this.setFocus($next.prop("id"), "text");
			}
		}
	}
	goRight(){
		var $el=$("#"+this.currentHtmlId);
		var $me=$el;
		if(this.currentFocus=="openingTagName") var $me=$el.find(".tag.opening").first();
		if(this.currentFocus=="closingTagName") var $me=$el.find(".tag.closing").last();
		if(this.currentFocus=="attributeName") var $me=$el.find(".attributeName").first();
		if(this.currentFocus=="attributeValue") var $me=$el.find(".attributeValue").first();
		if(this.currentFocus=="childrenCollapsed") var $me=$el.find(".childrenCollapsed").first();
		if(this.currentFocus=="rollouter") var $me=$el.find(".rollouter").first();

		var $candidates=this.$div.find(".focusable:visible");

		var $next=$candidates.eq( $candidates.index($me[0])+1 );
		if($next.hasClass("attributeName")) this.setFocus($next.closest(".attribute").prop("id"), "attributeName");
		if($next.hasClass("attributeValue")) this.setFocus($next.closest(".attribute").prop("id"), "attributeValue");
		if($next.hasClass("opening")) this.setFocus($next.closest(".element").prop("id"), "openingTagName");
		if($next.hasClass("closing")) this.setFocus($next.closest(".element").prop("id"), "closingTagName");
		if($next.hasClass("textnode")) this.setFocus($next.prop("id"), "text");
		if($next.hasClass("childrenCollapsed")) this.setFocus($next.closest(".element").prop("id"), "childrenCollapsed");
		if($next.hasClass("rollouter")) this.setFocus($next.closest(".element").prop("id"), "rollouter");
	}
	goLeft(){
		var $el=$("#"+this.currentHtmlId);
		var $me=$el;
		if(this.currentFocus=="openingTagName") var $me=$el.find(".tag.opening").first();
		if(this.currentFocus=="closingTagName") var $me=$el.find(".tag.closing").last();
		if(this.currentFocus=="attributeName") var $me=$el.find(".attributeName").first();
		if(this.currentFocus=="attributeValue") var $me=$el.find(".attributeValue").first();
		if(this.currentFocus=="childrenCollapsed") var $me=$el.find(".childrenCollapsed").first();
		if(this.currentFocus=="rollouter") var $me=$el.find(".rollouter").first();

		var $candidates=this.$div.find(".focusable:visible");

		var $next=$candidates.eq( $candidates.index($me[0])-1 );
		if($next.hasClass("attributeName")) this.setFocus($next.closest(".attribute").prop("id"), "attributeName");
		if($next.hasClass("attributeValue")) this.setFocus($next.closest(".attribute").prop("id"), "attributeValue");
		if($next.hasClass("opening")) this.setFocus($next.closest(".element").prop("id"), "openingTagName");
		if($next.hasClass("closing")) this.setFocus($next.closest(".element").prop("id"), "closingTagName");
		if($next.hasClass("textnode")) this.setFocus($next.prop("id"), "text");
		if($next.hasClass("childrenCollapsed")) this.setFocus($next.closest(".element").prop("id"), "childrenCollapsed");
		if($next.hasClass("rollouter")) this.setFocus($next.closest(".element").prop("id"), "rollouter");
	}
}

export default Xonomy;