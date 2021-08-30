// Xonomy instance objects
// ================================

// Note: some properties set to type 'never' on purpose to disambiguate union types in functions.
// If we don't some code may not compile.
// See https://github.com/microsoft/TypeScript/issues/12815#issuecomment-266356277

type XonomyElementInstance = {
	type: 'element';
	/** implementation detail */
	internalParent?: XonomyElementInstance;
	
	/**  more like an id, does not have to equal elementName */ 
	name: string
	/**  name of the xml element. */ 
	elementName: string
	htmlID: string
	parent(): XonomyElementInstance|undefined
	attributes: XonomyAttributeInstance[]
	children: Array<XonomyElementInstance|XonomyTextInstance>
	hasAttribute(name: string): boolean
	getAttribute(name: string): XonomyAttributeInstance
	/**  returns the value of the attribute with name, returns the second (default) if no such attribute exists */ 
	getAttributeValue(name: string, ifNull?: string): string
	/**  returns true if at least one child element exists */ 
	hasElements(): boolean
	hasChildElement(elementID: string): boolean
	/**  returns all child text concatenated together, '' is returned if no child text is present */ 
	getText(): string
	/**  get all child elements with name */ 
	getChildElements(elementID: string): Array<XonomyElementInstance|XonomyTextInstance>
	/**  get all descandants with name */ 
	getDescendantElements(elementID: string): XonomyElementInstance[]
	getPrecedingSibling(): XonomyElementInstance|null;
	getFollowingSibling(): XonomyElementInstance|null;
	setAttribute(name: string, value: string): void
	/**  append the text as XonomyTextInstance to this element's children. does not update the renderer */ 
	addText(text: string): void
}

type XonomyAttributeInstance = {
	type: 'attribute'
	name: string
	value: string
	htmlID: string
	parent(): XonomyElementInstance
}

type XonomyTextInstance = {
	type: 'text'
	value: string
	htmlID: string
	name?: never
	parent(): XonomyElementInstance
}

// Xonomy template definitions
// ======================================

type XonomyMenuAction = {
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
}

type XonomyElementDefinition = {
	displayName?: (instance: XonomyElementInstance) => string
	title?: (instance: XonomyElementInstance) => string
	caption?: (instance: XonomyElementInstance) => string

	attributes: Record<string, XonomyAttributeDefinition>
	menu: XonomyMenuAction[]
	inlineMenu: XonomyMenuAction[] 
	/**  list of other element names */ 
	canDropTo: string[];
	elementName(): string
	displayValue(instance: XonomyElementInstance): string
	backgroundColour(instance: XonomyElementInstance): string
	/** allow dropping to another parent? */ 
	localDropOnly(instance: XonomyElementInstance): boolean
	/** if there is a sibling whose name is listed, then it must be this element's preceding sibling */ 
	mustBeAfter(instance: XonomyElementInstance): string[]
	/** if there is a sibling whose name is listed, then this element must be its preceding sibling */ 
	mustBeBefore(instance: XonomyElementInstance): string[]
	/**  whether to use a more compact display for this element, only affects display */ 
	oneliner(instance: XonomyElementInstance): boolean
	/**  whether this element's contents are primarily text (perhaps with some inline markup elements) or whether it's just xml nodes, only affects display */ 
	hasText(instance: XonomyElementInstance): boolean
	/**  whether the collapsed state can be toggled by the user */ 
	collapsible(instance: XonomyElementInstance): boolean
	/**  initial state, ignored if collapsible is false */ 
	collapsed(instance: XonomyElementInstance): boolean
	/**  placeholder string for when the element is collapsed */ 
	collapsoid(instance: XonomyElementInstance): string
	isReadOnly(instance: XonomyElementInstance): boolean
	
	/**  whether to hide this (and all descendants!) in the interface */ 
	isInvisible(instance: XonomyElementInstance): boolean

	/** return html-as-string to render a popup the user can use to input a value */
	asker: (currentValue: string, askerParameter: any, instance: XonomyElementInstance) => string
	askerParameter: any;
}

type XonomyAttributeDefinition = {
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
	asker: (currentValue: string, askerParameter: any, instance: XonomyAttributeInstance) => string
	askerParameter: any
	/** I guess? */
	menu: XonomyMenuAction[]
}

type XonomyDocSpecOnChange = () => void;

type XonomyDocSpec = {
	elements: Record<string, XonomyElementDefinition>
	unknownElement: XonomyElementDefinition|((elementID: string) => XonomyElementDefinition)
	unknownAttribute: XonomyAttributeDefinition|((elementID: string, attributeName: string) => XonomyAttributeDefinition)
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
}

type XonomyPickListOption = string|{
	caption: string,
	value: string,
	displayValue?: string
}
type XonomyWhat = 'openingTagName'|'closingTagName'|'attributeName'|'attributeValue'|'text'|'rollouter'|'warner'|'childrenCollapsed';


// -----------------------------------------

class Surrogate {
	constructor(
		public parent: XonomyElementInstance
	) {}
}

const Xonomy = {
	lang: "", //"en"|"de"|fr"| ...
	mode: "nerd" as 'nerd'|'laic', //"nerd"|"laic"
	namespaces: {} as Record<string, string>, //eg. "xmlns:mbm": "http://lexonista.com"
	lastIDNum: 0,
	docSpec: null as null|XonomyDocSpec,
	harvestCache: {} as Record<string, XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance>,
	draggingID: null as null|string, //what are we dragging?
	notclick: false, //should the latest click-off event be ignored?
	lastAskerParam: null as any, // todo check usage
	
	// when-you-can - async requests to create autocompletions
	wycLastID: 0,
	wycCache: {} as Record<string, any>, // todo check if we can narrow the type a bit
	
	warnings: [] as Array<{htmlID: string, text: string}>, // filled by plugin function Xonomy.verify

	// keyboard navigation focus variables
	currentHtmlId: null as null|string,
	currentFocus: null as null|XonomyWhat,
	keyNav: false,
	
	lastClickWhat: "" as XonomyWhat,
	
	textFromID: "",
	textTillID: "",
	textFromIndex: 0,
	textTillIndex: 0,

	keyboardEventCatcher: null as null|JQuery<HTMLElement>,
	scrollableContainer: null as null|JQuery<HTMLElement>,

	/** Ignore the next keyUp event */
	notKeyUp: false,

	answer: null as null|((val: string) => void),

setMode(mode: 'nerd'|'laic') {
	if(mode=="nerd" || mode=="laic") Xonomy.mode=mode;
	if(mode=="nerd") $(".xonomy").removeClass("laic").addClass("nerd");
	if(mode=="laic") $(".xonomy").removeClass("nerd").addClass("laic");
},

jsEscape(str: string) {
  return String(str)
		.replace(/\"/g, '\\\"')
		.replace(/\'/g, '\\\'')
},
xmlEscape(str: string, jsEscape?: boolean) {
	if(jsEscape) str=Xonomy.jsEscape(str);
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
},
xmlUnscape(value: string){
	return String(value)
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&');
},
isNamespaceDeclaration(attributeName: string) {
	//Tells you whether an attribute name is a namespace declaration.
	var ret=false;
	if(attributeName=="xmlns") ret=true;
	if(attributeName.length>=6 && attributeName.substring(0, 6)=="xmlns:") ret=true;
	return ret;
},
xml2js(xml: string|Document|Element, jsParent?: XonomyElementInstance) {
	if(typeof(xml)=="string") xml=$.parseXML(xml);
	if('documentElement' in xml) xml=xml.documentElement;

	var js: XonomyElementInstance =new Surrogate(jsParent);
	js.type="element";
	js.elementName=xml.nodeName;
	js.name=Xonomy.docSpec.getElementId(js.elementName, jsParent ? jsParent.name : undefined);
	js.htmlID="";
	js.attributes=[];
	for(var i=0; i<xml.attributes.length; i++) {
		var attr=xml.attributes[i];
		if(!Xonomy.isNamespaceDeclaration(attr.nodeName)) {
			if(attr.name!="xml:space") {
				js["attributes"].push({type: "attribute", name: attr.nodeName, value: attr.value, htmlID: "", parent: function(){return js}, });
			}
		} else {
			Xonomy.namespaces[attr.nodeName]=attr.value;
		}
	}
	js.children=[];
	for(var i=0; i<xml.childNodes.length; i++) {
		var child=xml. childNodes[i];
		if(child.nodeType==1) { //element node
			js["children"].push(Xonomy.xml2js(child as Element, js));
		}
		if(child.nodeType==3) { //text node
			js["children"].push({type: "text", value: child.nodeValue, htmlID: "", parent: function(){return js}, });
		}
	}
	js=Xonomy.enrichElement(js);
	return js;
},
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
				else if(child.type=="element") xml+=Xonomy.js2xml(child); //element node
			}
			xml+="</"+js.elementName+">";
		} else {
			xml+="/>";
		}
		return xml;
	}
},
enrichElement(jsElement: XonomyElementInstance) {
	jsElement.hasAttribute=function(name) {
		var ret=false;
		for(var i=0; i<this.attributes.length; i++) {
			if(this.attributes[i].name==name) ret=true;
		}
		return ret;
	};
	jsElement.getAttribute=function(name) {
		var ret=null;
		for(var i=0; i<this.attributes.length; i++) {
			if(this.attributes[i].name==name) ret=this.attributes[i];
		}
		return ret;
	};
	jsElement.getAttributeValue=function(name, ifNull) {
		var ret=ifNull;
		for(var i=0; i<this.attributes.length; i++) {
			if(this.attributes[i].name==name) ret=this.attributes[i].value;
		}
		return ret;
	};
	jsElement.hasChildElement=function(name) {
		var ret=false;
		for(var i=0; i<this.children.length; i++) {
			if(this.children[i].name==name) ret=true;
		}
		return ret;
	};
	jsElement.getChildElements=function(name) {
		var ret=[];
		for(var i=0; i<this.children.length; i++) {
			if(this.children[i].type=="element") {
				if(this.children[i].name==name) ret.push(this.children[i]);
			}
		}
		return ret;
	};
	jsElement.getDescendantElements=function(name) {
		return this.children.flatMap(c => c.type === 'element' ? (c.name === name ? [c] : []).concat(c.getDescendantElements(name)) : []);
	};
	jsElement.getText=function(){
		var txt="";
		for(var c of this.children) {
			if(c.type=="text") txt+=c.value;
			else if(c.type=="element") txt+=c.getText();
		}
		return txt;
	};
	jsElement.hasElements=function(){
		for(var i=0; i<this.children.length; i++) {
			if(this.children[i].type=="element") return true;
		}
		return false;
	};
	jsElement.getPrecedingSibling=function(){
		var parent=this.parent();
		if(parent){
			var lastSibling=null;
			for(var i=0; i<parent.children.length; i++) {
				var sib = parent.children[i];
				if(sib.type=="element" && sib.htmlID!=this.htmlID) {
					lastSibling=sib;
				} else if(sib.htmlID==this.htmlID){
					return lastSibling;
				}
			}
		}
		return null;
	};
	jsElement.getFollowingSibling=function(){
		var parent=this.parent();
		if(parent){
			var seenSelf=false;
			for(var c of parent.children) {
				if(c.htmlID==this.htmlID){
					seenSelf=true;
				} else if(c.type=="element" && seenSelf) {
					return c;
				}
			}
		}
		return null;
	};
	jsElement.setAttribute=function(name, value){
		const el = this;
		if(this.hasAttribute(name)){
			this.getAttribute(name).value=value;
		} else {
			this.attributes.push({
				type: "attribute",
				name: name,
				value: value,
				htmlID: null,
				parent: function(){return el;}
			});
		}
	};
	jsElement.addText=function(txt){
		const el = this;
		this.children.push({
			htmlID: null,
			type: 'text',
			value: txt,
			parent() { return el; }
		});
	};
	return jsElement;
},

verifyDocSpec() { //make sure the docSpec object has everything it needs
	if(!Xonomy.docSpec || typeof(Xonomy.docSpec)!="object") Xonomy.docSpec={};
	if(!Xonomy.docSpec.elements || typeof(Xonomy.docSpec.elements)!="object") Xonomy.docSpec.elements={};
	if(!Xonomy.docSpec.onchange || typeof(Xonomy.docSpec.onchange)!="function") Xonomy.docSpec.onchange=function(){};
	if(!Xonomy.docSpec.validate || typeof(Xonomy.docSpec.validate)!="function") Xonomy.docSpec.validate=function(){};
	if(!Xonomy.docSpec.getElementId || typeof(Xonomy.docSpec.getElementId)!="function") Xonomy.docSpec.getElementId=function(elementName: string, parentDefinitionId: string) { return elementName; }
},

asFunction<T, I extends XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance|undefined>(specProperty: T|undefined|((inst?: I) => T), defaultValue: T): (inst?: I) => T {
	if(specProperty instanceof Function)
		return specProperty;
	else if (typeof(specProperty)==typeof(defaultValue))
		return function() { return specProperty; }
	else
		return function() { return defaultValue };
},
verifyDocSpecElement(name: string) { //make sure the DocSpec object has such an element, that the element has everything it needs
	if(!Xonomy.docSpec.elements[name] || typeof(Xonomy.docSpec.elements[name])!="object") {
		if(Xonomy.docSpec.unknownElement) {
			Xonomy.docSpec.elements[name]=(typeof(Xonomy.docSpec.unknownElement)==="function")
				? Xonomy.docSpec.unknownElement(name)
				: Xonomy.docSpec.unknownElement;
		}
		else Xonomy.docSpec.elements[name]={};
	}
	var spec: XonomyElementDefinition=Xonomy.docSpec.elements[name];
	if(!spec.attributes || typeof(spec.attributes)!="object") spec.attributes={};
	if(!spec.menu || typeof(spec.menu)!="object") spec.menu=[];
	if(!spec.inlineMenu || typeof(spec.inlineMenu)!="object") spec.inlineMenu=[];
	if(!spec.canDropTo || typeof(spec.canDropTo)!="object") spec.canDropTo=[];
	//if(!spec.mustBeAfter || typeof(spec.mustBeAfter)!="object") spec.mustBeAfter=[];
	//if(!spec.mustBeBefore || typeof(spec.mustBeBefore)!="object") spec.mustBeBefore=[];
	spec.mustBeAfter=Xonomy.asFunction(spec.mustBeAfter, []);
	spec.mustBeBefore=Xonomy.asFunction(spec.mustBeBefore, []);
	spec.oneliner=Xonomy.asFunction(spec.oneliner, false);
	spec.hasText=Xonomy.asFunction(spec.hasText, false);
	spec.collapsible=Xonomy.asFunction(spec.collapsible, true);
	spec.collapsed=Xonomy.asFunction(spec.collapsed, false);
	spec.localDropOnly=Xonomy.asFunction(spec.localDropOnly, false);
	spec.isReadOnly=Xonomy.asFunction(spec.isReadOnly, false);
	spec.isInvisible=Xonomy.asFunction(spec.isInvisible, false);
	spec.backgroundColour=Xonomy.asFunction(spec.backgroundColour, "");
	spec.elementName=Xonomy.asFunction(spec.elementName, name);
	if(spec.displayName) spec.displayName=Xonomy.asFunction(spec.displayName, "");
	if(spec.title) spec.title=Xonomy.asFunction(spec.title, "");
	if(spec.caption) spec.caption=Xonomy.asFunction(spec.caption, "");
	
	for(var i=0; i<spec.menu.length; i++) Xonomy.verifyDocSpecMenuItem(spec.menu[i]);
	for(var i=0; i<spec.inlineMenu.length; i++) Xonomy.verifyDocSpecMenuItem(spec.inlineMenu[i]);
	for(var attributeName in spec.attributes) Xonomy.verifyDocSpecAttribute(name, attributeName);
},
verifyDocSpecAttribute(elementName: string, attributeName: string) { //make sure the DocSpec object has such an attribute, that the attribute has everything it needs
	var elSpec=Xonomy.docSpec.elements[elementName];
	if(!elSpec.attributes[attributeName] || typeof(elSpec.attributes[attributeName])!="object") {
		if(Xonomy.docSpec.unknownAttribute) {
			elSpec.attributes[attributeName]=(typeof(Xonomy.docSpec.unknownAttribute)==="function")
				? Xonomy.docSpec.unknownAttribute(elementName, attributeName)
				: Xonomy.docSpec.unknownAttribute;
		}
		else elSpec.attributes[attributeName]={};
	}
	var spec=elSpec.attributes[attributeName];
	if(!(spec.asker instanceof Function)) spec.asker=function(){return ""};
	if(!spec.menu || typeof(spec.menu)!="object") spec.menu=[];
	spec.isReadOnly=Xonomy.asFunction(spec.isReadOnly, false);
	spec.isInvisible=Xonomy.asFunction(spec.isInvisible, false);
	spec.shy=Xonomy.asFunction(spec.shy, false);
	if(spec.displayName) spec.displayName=Xonomy.asFunction(spec.displayName, "");
	if(spec.title) spec.title=Xonomy.asFunction(spec.title, "");
	for(var i=0; i<spec.menu.length; i++) Xonomy.verifyDocSpecMenuItem(spec.menu[i]);
},
verifyDocSpecMenuItem(menuItem: XonomyMenuAction) { //make sure the menu item has all it needs
	menuItem.caption=Xonomy.asFunction(menuItem.caption, "?");
	if(!menuItem.action || typeof(menuItem.action)!="function") menuItem.action=function(){};
	if(!menuItem.hideIf) menuItem.hideIf=function(){return false;};
	if(typeof(menuItem.expanded)!="function") menuItem.expanded=Xonomy.asFunction(menuItem.expanded, false);
},

nextID() {
	return "xonomy"+(++Xonomy.lastIDNum);
},

refresh() {
	$(".xonomy .textnode[data-value='']").each(function(){ //delete empty text nodes if the parent element is not allowed to have text
		var $this=$(this);
		var $parent=$this.closest(".element");
		var parentName=$parent.data("name");
		var elSpec=Xonomy.docSpec.elements[parentName];
		if(elSpec && !elSpec.hasText(Xonomy.harvestElement($parent.toArray()[0]))) {
			$this.remove();
		}
	});
	$(".xonomy .children ").each(function(){ //determine whether each element does or doesn't have children:
		if(this.childNodes.length==0 && !$(this.parentNode).hasClass("hasText")) $(this.parentNode).addClass("noChildren");
		else {
			$(this.parentNode).removeClass("noChildren");
			Xonomy.updateCollapsoid(this.parentElement.id);
		}
	});
	$(".xonomy .element.hasText > .children > .element").each(function () { //determine whether each child element of hasText element should have empty text nodes on either side
		if($(this).prev().length == 0 || !$(this).prev().hasClass("textnode")) {
			$(this).before(Xonomy.renderText({ type: "text", value: "" }));
		}
		if($(this).next().length == 0 || !$(this).next().hasClass("textnode")) {
			$(this).after(Xonomy.renderText({ type: "text", value: "" }));
		}
	});
	var merged=false; while(!merged) { //merge adjacent text nodes
		merged=true; var textnodes=$(".xonomy .textnode").toArray();
		for(var i=0; i<textnodes.length; i++) {
			var $this=$(textnodes[i]);
			if($this.next().hasClass("textnode")) {
				var js1=Xonomy.harvestText($this.toArray()[0]);
				var js2=Xonomy.harvestText($this.next().toArray()[0]);
				js1.value+=js2.value;
				$this.next().remove();
				$this.replaceWith(Xonomy.renderText(js1));
				merged=false;
				break;
			}
		}
	}
	$(".xonomy .attribute ").each(function(){ //reorder attributes if necessary
		var atName=this.getAttribute("data-name");
		var elName=this.parentElement.parentElement.parentElement.getAttribute("data-name");
		var elSpec=Xonomy.docSpec.elements[elName];
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
	$(".xonomy .attributes").each(function(){ //determine whether each attribute list has any shy attributes:
		if($(this).children(".shy").toArray().length==0) {
			$(this.parentNode).children(".rollouter").hide().removeClass("rolledout");
			$(this).removeClass("rolledout").css("display", "");
		} else {
			$(this.parentNode).children(".rollouter").show();
		}
	});
	$(".xonomy .element").each(function(){ //refresh display names, display values and captions:
		var elSpec=Xonomy.docSpec.elements[this.getAttribute("data-name")];
		if(elSpec.displayName) $(this).children(".tag").children(".name").html(Xonomy.textByLang(elSpec.displayName(Xonomy.harvestElement(this))));
		if(elSpec.caption) {
			var jsEl=Xonomy.harvestElement(this);
			$(this).children(".inlinecaption").html(Xonomy.textByLang(elSpec.caption(jsEl)));
		}
		if(elSpec.displayValue) {
			var jsEl=Xonomy.harvestElement(this);
			if(!jsEl.hasElements()) $(this).children(".children").html(  Xonomy.textByLang(Xonomy.renderDisplayText(jsEl.getText(), elSpec.displayValue(jsEl))) );
		}
		$(this).children(".tag.opening").children(".attributes").children(".attribute").each(function(){
			var atSpec=elSpec.attributes[this.getAttribute("data-name")];
			if(atSpec.displayName) $(this).children(".name").html(Xonomy.textByLang(atSpec.displayName(Xonomy.harvestAttribute(this))));
			if(atSpec.displayValue) $(this).children(".value").html(Xonomy.textByLang(atSpec.displayValue(Xonomy.harvestAttribute(this))));
			if(atSpec.caption) $(this).children(".inlinecaption").html("&nbsp;"+Xonomy.textByLang(atSpec.caption(Xonomy.harvestAttribute(this)))+"&nbsp;");
		});
	});
},


harvest() { //harvests the contents of an editor
	//Returns xml-as-string.
	var rootElement=$(".xonomy .element").first().toArray()[0];
	var js=Xonomy.harvestElement(rootElement);
	for(var key in Xonomy.namespaces) {
		if(!js.hasAttribute(key)) js.attributes.push({
			type: "attribute",
			name: key,
			value: Xonomy.namespaces[key],
			parent: () => js,
			htmlID: '' // TODO unnecessary 
		});
	}
	return Xonomy.js2xml(js);
},
harvestElement(htmlElement: Element, jsParent?: XonomyElementInstance) {
	var htmlID=htmlElement.id;
	if(!Xonomy.harvestCache[htmlID]) {
		var js: XonomyElementInstance=new Surrogate(jsParent);
		js.type="element";
		js.name=htmlElement.getAttribute("data-name");
		/** @type {XonomyElementDefinition} */
		var docspecElement=Xonomy.docSpec.elements[js.name];
		js.elementName=docspecElement ? docspecElement.elementName() : js.name;
		js.htmlID=htmlElement.id;
		js.attributes=[];
		var htmlAttributes=$(htmlElement).find(".tag.opening > .attributes").toArray()[0];
		for(var i=0; i<htmlAttributes.children.length; i++) {
			var htmlAttribute=htmlAttributes.children[i];
			if($(htmlAttribute).hasClass("attribute")) js["attributes"].push(Xonomy.harvestAttribute(htmlAttribute, js));
		}
		js.children=[];
		var htmlChildren=$(htmlElement).children(".children").toArray()[0];
		for(var i=0; i<htmlChildren.children.length; i++) {
			var htmlChild=htmlChildren.children[i];
			if($(htmlChild).hasClass("element")) js["children"].push(Xonomy.harvestElement(htmlChild, js));
			else if($(htmlChild).hasClass("textnode")) js["children"].push(Xonomy.harvestText(htmlChild, js));
		}
		js=Xonomy.enrichElement(js);
		Xonomy.harvestCache[htmlID]=js;
	}
	return Xonomy.harvestCache[htmlID] as XonomyElementInstance;
},
harvestAttribute(htmlAttribute: Element, jsParent?: XonomyElementInstance) {
	var htmlID=htmlAttribute.id;
	if(!Xonomy.harvestCache[htmlID]) {
		var js: XonomyAttributeInstance = new Surrogate(jsParent);
		js.type = "attribute";
		js.name = htmlAttribute.getAttribute("data-name");
		js.htmlID = htmlAttribute.id;
		js.value = htmlAttribute.getAttribute("data-value");
		Xonomy.harvestCache[htmlID]=js;
	}
	return Xonomy.harvestCache[htmlID] as XonomyAttributeInstance;
},

harvestText(htmlText: Element, jsParent?: XonomyElementInstance) {
	var js: XonomyTextInstance = new Surrogate(jsParent);
	js.type = "text";
	js.htmlID = htmlText.id;
	js.value = htmlText.getAttribute("data-value");
	return js;
},
/** Return the parent element harvest. The js argument is put in the element's attributes/children array instead of whatever is harvested there. */
harvestParentOf(js: XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance): null|XonomyElementInstance {
	var jsParent=null;
	var $parent=$("#"+js.htmlID).parent().closest(".element");
	if($parent.toArray().length==1) {
		jsParent=Xonomy.harvestElement($parent.toArray()[0]);
		for(var i=0; i<jsParent.attributes.length; i++) if(jsParent.attributes[i].htmlID==js.htmlID && js.type === 'attribute') jsParent.attributes[i]=js;
		for(var i=0; i<jsParent.children.length; i++) if(jsParent.children[i].htmlID==js.htmlID && js.type === 'element') jsParent.children[i]=js;
	}
	return jsParent;
},
render(data: string|Document|XonomyElementInstance, editor: string|HTMLElement, docSpec: XonomyDocSpec) { //renders the contents of an editor
	//The data can be a Xonomy-compliant XML document, a Xonomy-compliant xml-as-string,
	//or a Xonomy-compliant JavaScript object.
	//The editor can be an HTML element, or the string ID of one.
	Xonomy.docSpec=docSpec;
	Xonomy.verifyDocSpec();

	//Clear namespace cache:
	Xonomy.namespaces={};

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
	if(data instanceof Document) data=Xonomy.xml2js(data);

	//Make sure editor refers to an HTML element, if it doesn't already:
	if(typeof(editor)=="string") editor=document.getElementById(editor);
	if(!$(editor).hasClass("xonomy")) $(editor).addClass("xonomy"); //make sure it has class "xonomy"
	$(editor).addClass(Xonomy.mode);

	$(editor).hide();
	editor.innerHTML=Xonomy.renderElement(data);
	$(editor).show();

	if(docSpec.allowLayby){
		var laybyHtml="<div class='layby closed empty' onclick='if($(this).hasClass(\"closed\")) Xonomy.openLayby()' ondragover='Xonomy.dragOver(event)' ondragleave='Xonomy.dragOut(event)' ondrop='Xonomy.drop(event)''>";
		laybyHtml+="<span class='button closer' onclick='Xonomy.closeLayby();'>&nbsp;</span>";
		laybyHtml+="<span class='button purger' onclick='Xonomy.emptyLayby()'>&nbsp;</span>";
		laybyHtml+="<div class='content'></div>";
		laybyHtml+="<div class='message'>"+Xonomy.textByLang(docSpec.laybyMessage)+"</div>";
		laybyHtml+="</div>";
		$(laybyHtml).appendTo($(editor));
	}

	if(docSpec.allowModeSwitching){
		$("<div class='modeSwitcher'><span class='nerd'></span><span class='laic'></span></div>").appendTo($(editor)).on("click", function(e){
			if(Xonomy.mode=="nerd") { Xonomy.setMode("laic"); } else { Xonomy.setMode("nerd"); }
			if(docSpec.onModeSwitch) docSpec.onModeSwitch(Xonomy.mode);
		});
	}

	//Make sure the "click off" handler is attached:
	$(document.body).off("click", Xonomy.clickoff);
	$(document.body).on("click", Xonomy.clickoff);

	//Make sure the "drag end" handler is attached:
	$(document.body).off("dragend", Xonomy.dragend);
	$(document.body).on("dragend", Xonomy.dragend);

	Xonomy.refresh();
	Xonomy.validate();
},

renderElement(element: XonomyElementInstance) {
	var htmlID=Xonomy.nextID();
	Xonomy.verifyDocSpecElement(element.name);
	var spec=Xonomy.docSpec.elements[element.name];
	var classNames="element";
	if(spec.canDropTo && spec.canDropTo.length>0) classNames+=" draggable";
	var hasText = spec.hasText(element);
	if(hasText) classNames+=" hasText";
	if(spec.inlineMenu && spec.inlineMenu.length>0) classNames+=" hasInlineMenu";
	if(spec.oneliner(element)) classNames+=" oneliner";
	if(!spec.collapsible(element)) {
		classNames+=" uncollapsible";
	} else {
		if(spec.collapsed(element) && element.children.length>0) classNames+=" collapsed";
	}
	if(spec.isInvisible && spec.isInvisible(element)) { classNames+=" invisible"; }
	if(spec.isReadOnly && spec.isReadOnly(element)) { classNames+=" readonly"; }
	if(spec.menu.length>0) classNames+=" hasMenu"; //not always accurate: whether an element has a menu is actually determined at runtime
	var displayName=element.elementName;
	if(spec.displayName) displayName=Xonomy.textByLang(spec.displayName(element));
	var title="";
	if(spec.title) title=Xonomy.textByLang(spec.title(element));
	var html="";
	html+='<div data-name="'+element.name+'" id="'+htmlID+'" class="'+classNames+'">';
		html+='<span class="connector">';
			html+='<span class="plusminus" onclick="Xonomy.plusminus(\''+htmlID+'\')"></span>';
			html+='<span class="draghandle" draggable="true" ondragstart="Xonomy.drag(event)"></span>';
		html+='</span>';
		html+='<span class="tag opening focusable" style="background-color: '+spec.backgroundColour(element)+';">';
			html+='<span class="punc">&lt;</span>';
			html+='<span class="warner"><span class="inside" onclick="Xonomy.click(\''+htmlID+'\', \'warner\')"></span></span>';
			html+='<span class="name" title="'+title+'" onclick="Xonomy.click(\''+htmlID+'\', \'openingTagName\')">'+displayName+'</span>';
			html+='<span class="attributes">';
				for(var i=0; i<element.attributes.length; i++) {
					Xonomy.verifyDocSpecAttribute(element.name, element.attributes[i].name);
					html+=Xonomy.renderAttribute(element.attributes[i], element.name);
				}
			html+='</span>';
			html+='<span class="rollouter focusable" onclick="Xonomy.click(\''+htmlID+'\', \'rollouter\')"></span>';
			html+='<span class="punc slash">/</span>';
			html+='<span class="punc">&gt;</span>';
		html+='</span>';
		if(spec.caption && !spec.oneliner(element)) html+="<span class='inlinecaption'>"+Xonomy.textByLang(spec.caption(element))+"</span>";
		html+='<span class="childrenCollapsed focusable" onclick="Xonomy.plusminus(\''+htmlID+'\', true)">&middot;&middot;&middot;</span>';
		html+='<div class="children">';
			if(spec.displayValue && !element.hasElements()) {
				html+=Xonomy.renderDisplayText(element.getText(), spec.displayValue(element));
			} else {
				var prevChildType="";
				if(hasText && (element.children.length==0 || element.children[0].type=="element")) {
					html+=Xonomy.renderText({type: "text", value: ""}); //if inline layout, insert empty text node between two elements
				}
				for(var i=0; i<element.children.length; i++) {
					var child=element.children[i];
					if(hasText && prevChildType=="element" && child.type=="element") {
						html+=Xonomy.renderText({type: "text", value: ""}); //if inline layout, insert empty text node between two elements
					}
					if(child.type=="text") html+=Xonomy.renderText(child); //text node
					else if(child.type=="element") html+=Xonomy.renderElement(child); //element node
					prevChildType=child.type;
				}
				if(hasText && element.children.length>1 && element.children[element.children.length-1].type=="element") {
					html+=Xonomy.renderText({type: "text", value: ""}); //if inline layout, insert empty text node between two elements
				}
			}
		html+='</div>';
		html+='<span class="tag closing focusable" style="background-color: '+spec.backgroundColour(element)+';">';
			html+='<span class="punc">&lt;</span>';
			html+='<span class="punc">/</span>';
			html+='<span class="name" onclick="Xonomy.click(\''+htmlID+'\', \'closingTagName\')">'+displayName+'</span>';
			html+='<span class="punc">&gt;</span>';
		html+='</span>';
		if(spec.caption && spec.oneliner(element)) html+="<span class='inlinecaption'>"+Xonomy.textByLang(spec.caption(element))+"</span>";
	html+='</div>';
	element.htmlID = htmlID;
	return html;
},
renderAttribute(attribute: XonomyAttributeInstance, optionalParentName?: string) {
	var htmlID=Xonomy.nextID();
	var classNames="attribute";
	var readonly=false;

	var displayName=attribute.name;
	var displayValue=Xonomy.xmlEscape(attribute.value);
	var caption="";
	var title="";
	if(optionalParentName) {
		var spec=Xonomy.docSpec.elements[optionalParentName].attributes[attribute.name];
		if(spec) {
			if(spec.displayName) displayName=Xonomy.textByLang(spec.displayName(attribute));
			if(spec.displayValue) displayValue=Xonomy.textByLang(spec.displayValue(attribute));
			if(spec.title) title=Xonomy.textByLang(spec.title(attribute));
			if(spec.caption) caption=Xonomy.textByLang(spec.caption(attribute));
			if(spec.isReadOnly && spec.isReadOnly(attribute)) { readonly=true; classNames+=" readonly"; }
			if(spec.isInvisible && spec.isInvisible(attribute)) { classNames+=" invisible"; }
			if(spec.shy && spec.shy(attribute)) { classNames+=" shy"; }
		}
	}

	var isURL=false;
	if (displayValue.startsWith("https://") || displayValue.startsWith("http://"))
		isURL=true;
	var html="";
	html+='<span data-name="'+attribute.name+'" data-value="'+Xonomy.xmlEscape(attribute.value)+'" id="'+htmlID+'" class="'+classNames+'">';
		html+='<span class="punc"> </span>';
		var onclick=''; if(!readonly) onclick=' onclick="Xonomy.click(\''+htmlID+'\', \'attributeName\')"';
		html+='<span class="warner"><span class="inside" onclick="Xonomy.click(\''+htmlID+'\', \'warner\')"></span></span>';
		html+='<span class="name attributeName focusable" title="'+title+'"'+onclick+'>'+displayName+'</span>';
		html+='<span class="punc">=</span>';
		var onclick=''; if(!readonly) onclick=' onclick="Xonomy.click(\''+htmlID+'\', \'attributeValue\')"';
		html+='<span class="valueContainer attributeValue focusable"'+onclick+'>';
			html+='<span class="punc">"</span>';
			if (isURL)
				html+='<span class="value" title="'+displayValue+'">URL</span>';
			else
				html+='<span class="value">'+displayValue+'</span>';
			html+='<span class="punc">"</span>';
		html+='</span>';
		if (isURL)
			caption = '<a href="'+displayValue+'" target=' + attribute.name + '>🔗</a> ' + caption;
		if(caption) html+="<span class='inlinecaption'>"+caption+"</span>";
	html+='</span>';
	attribute.htmlID = htmlID;
	return html;
},
renderText<T extends {value: string}>(text: T) {
	var htmlID=Xonomy.nextID();
	var classNames="textnode focusable";
	if($.trim(text.value)=="") classNames+=" whitespace";
	if(text.value=="") classNames+=" empty";
	var html="";
	html+='<div id="'+htmlID+'" data-value="'+Xonomy.xmlEscape(text.value)+'" class="'+classNames+'">';
		html+='<span class="connector"></span>';
		var txt=Xonomy.chewText(text.value);
		html+='<span class="value" onclick="Xonomy.click(\''+htmlID+'\', \'text\')"><span class="insertionPoint"><span class="inside"></span></span><span class="dots"></span>'+txt+'</span>';
	html+='</div>';
	text.htmlID = htmlID;
	return html;
},
renderDisplayText(text: string, displayText: string) {
	var htmlID=Xonomy.nextID();
	var classNames="textnode";
	if($.trim(displayText)=="") classNames+=" whitespace";
	if(displayText=="") classNames+=" empty";
	var html="";
	html+='<div id="'+htmlID+'" data-value="'+Xonomy.xmlEscape(text)+'" class="'+classNames+'">';
		html+='<span class="connector"></span>';
		html+='<span class="value" onclick="Xonomy.click(\''+htmlID+'\', \'text\')"><span class="insertionPoint"><span class="inside"></span></span><span class="dots"></span>'+Xonomy.textByLang(displayText)+'</span>';
	html+='</div>';
	return html;
},
/** wrap text in some html to render it in the editor as a text node */
chewText(txt: string) {
	return "<span class='word focusable' onclick='if((event.ctrlKey||event.metaKey) && $(this).closest(\".element\").hasClass(\"hasInlineMenu\")) Xonomy.wordClick(this)'>" + txt + "</span>"
},
/** @param c the span where the textnode is rendered in the editor */
wordClick(c: HTMLElement) {
	var $element=$(c);
	Xonomy.clickoff();
	var isReadOnly=( $element.closest(".readonly").toArray().length>0 );
	if(!isReadOnly) {
		var htmlID=$element.attr("id");
		var content=Xonomy.inlineMenu(htmlID); //compose bubble content
		if(content!="" && content!="<div class='menu'></div>") {
			document.body.appendChild(Xonomy.makeBubble(content)); //create bubble
			Xonomy.showBubble($(c).last()); //anchor bubble to the word
		}
  }
},
wrap(htmlID: string, param: {template: string, placeholder: string}) {
	Xonomy.clickoff();
	Xonomy.destroyBubble();
	var xml=param.template;
	var ph=param.placeholder;
	var jsElement=Xonomy.harvestElement(document.getElementById(htmlID));
	if(Xonomy.textFromID==Xonomy.textTillID) { //abc --> a<XYZ>b</XYZ>c
		var jsOld=Xonomy.harvestText(document.getElementById(Xonomy.textFromID));
		var txtOpen=jsOld.value.substring(0, Xonomy.textFromIndex);
		var txtMiddle=jsOld.value.substring(Xonomy.textFromIndex, Xonomy.textTillIndex+1);
		var txtClose=jsOld.value.substring(Xonomy.textTillIndex+1);
		xml=xml.replace(ph, Xonomy.xmlEscape(txtMiddle));
		var html="";
		html+=Xonomy.renderText({type: "text", value: txtOpen});
		var js=Xonomy.xml2js(xml, jsElement); html+=Xonomy.renderElement(js); var newID=js.htmlID;
		html+=Xonomy.renderText({type: "text", value: txtClose});
		$("#"+Xonomy.textFromID).replaceWith(html);
		window.setTimeout(function(){ Xonomy.setFocus(newID, "openingTagName"); }, 100);
	} else { //ab<...>cd --> a<XYZ>b<...>c</XYZ>d
		var jsOldOpen=Xonomy.harvestText(document.getElementById(Xonomy.textFromID));
		var jsOldClose=Xonomy.harvestText(document.getElementById(Xonomy.textTillID));
		var txtOpen=jsOldOpen.value.substring(0, Xonomy.textFromIndex);
		var txtMiddleOpen=jsOldOpen.value.substring(Xonomy.textFromIndex);
		var txtMiddleClose=jsOldClose.value.substring(0, Xonomy.textTillIndex+1);
		var txtClose=jsOldClose.value.substring(Xonomy.textTillIndex+1);
		xml=xml.replace(ph, Xonomy.xmlEscape(txtMiddleOpen)+ph);
		$("#"+Xonomy.textFromID).nextUntil("#"+Xonomy.textTillID).each(function(){
			if($(this).hasClass("element")) xml=xml.replace(ph, Xonomy.js2xml(Xonomy.harvestElement(this))+ph);
			else if($(this).hasClass("textnode")) xml=xml.replace(ph, Xonomy.js2xml(Xonomy.harvestText(this))+ph);
		});
		xml=xml.replace(ph, Xonomy.xmlEscape(txtMiddleClose));
		$("#"+Xonomy.textFromID).nextUntil("#"+Xonomy.textTillID).remove();
		$("#"+Xonomy.textTillID).remove();
		var html="";
		html+=Xonomy.renderText({type: "text", value: txtOpen});
		var js=Xonomy.xml2js(xml, jsElement); html+=Xonomy.renderElement(js); var newID=js.htmlID;
		html+=Xonomy.renderText({type: "text", value: txtClose});
		$("#"+Xonomy.textFromID).replaceWith(html);
		window.setTimeout(function(){ Xonomy.setFocus(newID, "openingTagName"); }, 100);
	}
	Xonomy.changed();
},
/** remove an element node and replace it with its children */
unwrap(htmlID: string) {
	var parentID=$("#"+htmlID)[0].parentElement.parentElement.id;
	Xonomy.clickoff();
	$("#"+htmlID).replaceWith($("#"+htmlID+" > .children > *"));
	Xonomy.changed();
	window.setTimeout(function(){ Xonomy.setFocus(parentID, "openingTagName");  }, 100);
},
/** collapse/expand an xml node */
plusminus(htmlID: string, forceExpand?: boolean) {
	var $element=$("#"+htmlID);
	var $children=$element.children(".children");
	if($element.hasClass("collapsed")) {
		$children.hide();
		$element.removeClass("collapsed");
		if($element.hasClass("oneliner")) $children.fadeIn("fast"); else $children.slideDown("fast");
	} else if(!forceExpand) {
		Xonomy.updateCollapsoid(htmlID);
		if($element.hasClass("oneliner")) $children.fadeOut("fast", function(){ $element.addClass("collapsed"); });
		else $children.slideUp("fast", function(){ $element.addClass("collapsed"); });
	}
	window.setTimeout(function(){
		if($("#"+Xonomy.currentHtmlId+" .opening:visible").length>0) {
			Xonomy.setFocus(Xonomy.currentHtmlId, "openingTagName");
		} else {
			Xonomy.setFocus(Xonomy.currentHtmlId, "childrenCollapsed");
		}
	}, 300);
},
/** update the small preview that is displayed for collapsed elements */
updateCollapsoid(htmlID: string) {
	var $element=$("#"+htmlID);
	var whisper="";
	var elementName=$element.data("name");
	var spec=Xonomy.docSpec.elements[elementName];
	if(spec.collapsoid) {
		whisper=spec.collapsoid(Xonomy.harvestElement($element.toArray()[0]));
	} else {
		var abbreviated=false;
		$element.find(".textnode").each(function(){
			var txt=Xonomy.harvestText(this).value;
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
},


click(htmlID: string, what: XonomyWhat) {
	if(!Xonomy.notclick) {
		Xonomy.clickoff();
		Xonomy.lastClickWhat=what;
		Xonomy.currentHtmlId=htmlID;
		Xonomy.currentFocus=what;
		var isReadOnly=( $("#"+htmlID).hasClass("readonly") || $("#"+htmlID).closest(".readonly").toArray().length>0 );
		if(!isReadOnly && (what=="openingTagName" || what=="closingTagName") ) {
			$("#"+htmlID).addClass("current"); //make the element current
			var content: string=Xonomy.elementMenu(htmlID); //compose bubble content
			if(content!="" && content!="<div class='menu'></div>") {
				document.body.appendChild(Xonomy.makeBubble(content)); //create bubble
				if(what=="openingTagName") Xonomy.showBubble($("#"+htmlID+" > .tag.opening > .name")); //anchor bubble to opening tag
				if(what=="closingTagName") Xonomy.showBubble($("#"+htmlID+" > .tag.closing > .name")); //anchor bubble to closing tag
			}
			var surrogateElem = Xonomy.harvestElement(document.getElementById(htmlID));
			$("#"+htmlID).trigger("xonomy-click-element", [surrogateElem]);
		}
		if(!isReadOnly && what=="attributeName") {
			$("#"+htmlID).addClass("current"); //make the attribute current
			var content: string=Xonomy.attributeMenu(htmlID); //compose bubble content
			if(content!="" && content!="<div class='menu'></div>") {
				document.body.appendChild(Xonomy.makeBubble(content)); //create bubble
				Xonomy.showBubble($("#"+htmlID+" > .name")); //anchor bubble to attribute name
			}
			var surrogateAttr = Xonomy.harvestAttribute(document.getElementById(htmlID));
			$("#"+htmlID).trigger("xonomy-click-attribute", [surrogateAttr]);
		}
		if(!isReadOnly && what=="attributeValue") {
			$("#"+htmlID+" > .valueContainer").addClass("current"); //make attribute value current
			var name=$("#"+htmlID).attr("data-name"); //obtain attribute's name
			var value=$("#"+htmlID).attr("data-value"); //obtain current value
			var elName=$("#"+htmlID).closest(".element").attr("data-name");
			Xonomy.verifyDocSpecAttribute(elName, name);
			const spec=Xonomy.docSpec.elements[elName].attributes[name];
			var content: string=spec.asker(value, spec.askerParameter, Xonomy.harvestAttribute(document.getElementById(htmlID))); //compose bubble content
			if(content!="" && content!="<div class='menu'></div>") {
				document.body.appendChild(Xonomy.makeBubble(content)); //create bubble
				Xonomy.showBubble($("#"+htmlID+" > .valueContainer > .value")); //anchor bubble to value
				Xonomy.answer=function(val: string) {
					var obj=document.getElementById(htmlID);
					var html=Xonomy.renderAttribute({type: "attribute", name: name, value: val}, elName);
					$(obj).replaceWith(html);
					Xonomy.changed();
					window.setTimeout(function(){Xonomy.clickoff(); Xonomy.setFocus($(html).prop("id"), what)}, 100);
				};
			}
		}
		if(!isReadOnly && what=="text") {
			$("#"+htmlID).addClass("current");
			var value=$("#"+htmlID).attr("data-value"); //obtain current value
			var elName=$("#"+htmlID).closest(".element").attr("data-name");
			const spec=Xonomy.docSpec.elements[elName];
			if (typeof(spec.asker) != "function") {
				var content: string=Xonomy.askLongString(value, null, Xonomy.harvestElement($("#"+htmlID).closest(".element").toArray()[0])); //compose bubble content
			} else {
				var content: string=spec.asker(value, spec.askerParameter, Xonomy.harvestElement($("#"+htmlID).closest(".element").toArray()[0])); //use specified asker
			}
			if(content!="" && content!="<div class='menu'></div>") {
				document.body.appendChild(Xonomy.makeBubble(content)); //create bubble
				Xonomy.showBubble($("#"+htmlID+" > .value")); //anchor bubble to value
				Xonomy.answer=function(val: string) {
					var obj=document.getElementById(htmlID);
					var jsText = {type: "text", value: val};
					var html=Xonomy.renderText(jsText);
					$(obj).replaceWith(html);
					// @ts-ignore jsText.htmlId added by Xonomy.renderText (needs to be added to documentation)
					Xonomy.changed(Xonomy.harvestText(document.getElementById(jsText.htmlID)));
					window.setTimeout(function(){Xonomy.clickoff(); Xonomy.setFocus($(html).prop("id"), what)}, 100);
				};
			}
		}
		if(what=="warner") {
			//$("#"+htmlID).addClass("current");
			var content=""; //compose bubble content
			for(var iWarning=0; iWarning<Xonomy.warnings.length; iWarning++) {
				var warning=Xonomy.warnings[iWarning];
				if(warning.htmlID==htmlID) {
					content+="<div class='warning'>"+Xonomy.formatCaption(Xonomy.textByLang(warning.text))+"</div>";
				}
			}
			document.body.appendChild(Xonomy.makeBubble(content)); //create bubble
			Xonomy.showBubble($("#"+htmlID+" .warner .inside").first()); //anchor bubble to warner
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
			window.setTimeout(function(){Xonomy.setFocus(htmlID, "rollouter")}, 100);
		}
		Xonomy.notclick=true;
	}
},

clickoff(ev?: JQuery.ClickEvent) { //event handler for the document-wide click-off event.
	if(!Xonomy.notclick) {
		Xonomy.currentHtmlId=null;
		Xonomy.currentFocus=null;
		Xonomy.destroyBubble();
		$(".xonomy .current").removeClass("current");
		$(".xonomy .focused").removeClass("focused");
	}
	Xonomy.notclick=false;
},

destroyBubble() {
	if(document.getElementById("xonomyBubble")) {
		var bubble=document.getElementById("xonomyBubble");
		$(bubble).find(":focus").blur();
		bubble.parentNode.removeChild(bubble);
		if(Xonomy.keyboardEventCatcher) Xonomy.keyboardEventCatcher.focus();
	}
},
makeBubble(content: string) {
	Xonomy.destroyBubble();
	var bubble=document.createElement("div");
	bubble.id="xonomyBubble";
	bubble.className=Xonomy.mode;
	bubble.innerHTML="<div class='inside' onclick='Xonomy.notclick=true;'>"
			+"<div id='xonomyBubbleContent'>"+content+"</div>"
		+"</div>";
	return bubble;
},
showBubble($anchor: JQuery<HTMLElement>) {
	var $bubble=$("#xonomyBubble");
	var offset=$anchor.offset();
	var screenWidth = $("body").width();
	var screenHeight = $(document).height();
	var bubbleHeight = $bubble.outerHeight();
	var width = $anchor.width(); if (width > 40) width = 40;
	var height = $anchor.height(); if (height > 25) height = 25;
	if (Xonomy.mode == "laic") { width = width - 25; height = height + 10; }

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
		if(Xonomy.keyNav) $bubble.find(".focusme").first().focus(); //if the context menu contains anything with the class name 'focusme', focus it.
		else $bubble.find("input.focusme, select.focusme, textarea.focusme").first().focus();
	});

	$bubble.on("keyup", function(event){
		if(event.which==27) Xonomy.destroyBubble();
	});

	if(Xonomy.keyNav) {
		$bubble.find("div.focusme").on("keyup", function(event){
			if(event.which==40) { //down key
				var $item=$(event.delegateTarget);
				var $items=$bubble.find(".focusme:visible");
				var $next=$items.eq( $items.index($item[0])+1 );
				$next.focus();
			}
			if(event.which==38) { //up key
				var $item=$(event.delegateTarget);
				var $items=$bubble.find("div.focusme:visible");
				var $next=$items.eq( $items.index($item[0])-1 );
				$next.focus();
			}
			if(event.which==13) { //enter key
				$(event.delegateTarget).click();
				Xonomy.notclick=false;
			}
		});
	}
},
/** Return html-as-string that contains a form that when submitted calls the Xonomy.answer function */
askString(defaultString: string, askerParameter: any, jsMe: XonomyElementInstance|XonomyTextInstance|XonomyAttributeInstance) {
	var width=($("body").width()*.5)-75
	var html="";
	html+="<form onsubmit='Xonomy.answer(this.val.value); return false'>";
		html+="<input name='val' class='textbox focusme' style='width: "+width+"px;' value='"+Xonomy.xmlEscape(defaultString)+"' onkeyup='Xonomy.notKeyUp=true'/>";
		html+=" <input type='submit' value='OK'>";
	html+="</form>";
	return html;
},
askLongString(defaultString: string, askerParameter?: any, jsMe?: XonomyElementInstance|XonomyTextInstance|XonomyAttributeInstance) {
	var width=($("body").width()*.5)-75
	var html="";
	html+="<form onsubmit='Xonomy.answer(this.val.value); return false'>";
		html+="<textarea name='val' class='textbox focusme' spellcheck='false' style='width: "+width+"px; height: 150px;'>"+Xonomy.xmlEscape(defaultString)+"</textarea>";
		html+="<div class='submitline'><input type='submit' value='OK'></div>";
	html+="</form>";
	return html;
},
askPicklist(defaultString: string, picklist: XonomyPickListOption[], jsMe: XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance) {
	var html="";
	html+=Xonomy.pickerMenu(picklist, defaultString);
	return html;
},
/** open-ended picklist */
askOpenPicklist(defaultString: string, picklist: XonomyPickListOption[]) {
	var isInPicklist=false;
    var html="";
		html+=Xonomy.pickerMenu(picklist, defaultString);
		html+="<form class='undermenu' onsubmit='Xonomy.answer(this.val.value); return false'>";
		html+="<input name='val' class='textbox focusme' value='"+(!isInPicklist ? Xonomy.xmlEscape(defaultString) : "")+"' onkeyup='Xonomy.notKeyUp=true'/>";
		html+=" <input type='submit' value='OK'>";
		html+="</form>";
    return html;
},


askRemote(defaultString: string, param: {add?: XonomyPickListOption[], url: string, searchUrl: string, urlPlaceholder: string, createUrl: string}, jsMe: XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance) {
	var html="";
	if(param.searchUrl || param.createUrl) {
		html+="<form class='overmenu' onsubmit='return Xonomy.remoteSearch(\""+Xonomy.xmlEscape(param.searchUrl, true)+"\", \""+Xonomy.xmlEscape(param.urlPlaceholder, true)+"\", \""+Xonomy.xmlEscape(Xonomy.jsEscape(defaultString))+"\")'>";
		html+="<input name='val' class='textbox focusme' value=''/>";
		if(param.searchUrl) html+=" <button class='buttonSearch' onclick='return Xonomy.remoteSearch(\""+Xonomy.xmlEscape(param.searchUrl, true)+"\", \""+Xonomy.xmlEscape(param.urlPlaceholder, true)+"\", \""+Xonomy.xmlEscape(Xonomy.jsEscape(defaultString))+"\")'>&nbsp;</button>";
		if(param.createUrl) html+=" <button class='buttonCreate' onclick='return Xonomy.remoteCreate(\""+Xonomy.xmlEscape(param.createUrl, true)+"\", \""+Xonomy.xmlEscape( (param.searchUrl?param.searchUrl:param.url) , true)+"\", \""+Xonomy.xmlEscape(param.urlPlaceholder, true)+"\", \""+Xonomy.xmlEscape(Xonomy.jsEscape(defaultString))+"\")'>&nbsp;</button>";
		html+="</form>";
	}
	html+=Xonomy.wyc(param.url, function(items: XonomyPickListOption[]){
		if(param.add) for(var i=0; i<param.add.length; i++) items.push(param.add[i]);
		return Xonomy.pickerMenu(items, defaultString);
	});
	Xonomy.lastAskerParam=param;
	return html;
},

remoteSearch(searchUrl: string, urlPlaceholder: string, defaultString: string){
	var text=$("#xonomyBubble input.textbox").val() as string;
	searchUrl=searchUrl.replace(urlPlaceholder, encodeURIComponent(text));
	$("#xonomyBubble .menu").replaceWith( Xonomy.wyc(searchUrl, function(picklist: XonomyPickListOption[]){
		var items=[];
		if(text=="" && Xonomy.lastAskerParam.add) for(var i=0; i<Xonomy.lastAskerParam.add.length; i++) items.push(Xonomy.lastAskerParam.add[i]);
		for(var i=0; i<picklist.length; i++) items.push(picklist[i]);
		return Xonomy.pickerMenu(items, defaultString);
	}));
	return false;
},
remoteCreate(createUrl: string, searchUrl: string, urlPlaceholder: string, defaultString: string){
	var text=$.trim($("#xonomyBubble input.textbox").val() as string);
	if(text!="") {
		createUrl=createUrl.replace(urlPlaceholder, encodeURIComponent(text));
		searchUrl=searchUrl.replace(urlPlaceholder, encodeURIComponent(text));
		$.ajax({url: createUrl, dataType: "text", method: "POST"}).done(function(data){
			if(Xonomy.wycCache[searchUrl]) delete Xonomy.wycCache[searchUrl];
			$("#xonomyBubble .menu").replaceWith( Xonomy.wyc(searchUrl, function(picklist: XonomyPickListOption[]){ return Xonomy.pickerMenu(picklist, defaultString); }) );
		});
	}
	return false;
},
pickerMenu(picklist: XonomyPickListOption[], defaultString: string){
	var html="";
	html+="<div class='menu'>";
	for(var i=0; i<picklist.length; i++) {
		var item=picklist[i];
		if(typeof(item)=="string") item={value: item, caption: ""};
		html+="<div class='menuItem focusme techno"+(item.value==defaultString?" current":"")+"' tabindex='1' onclick='Xonomy.answer(\""+Xonomy.xmlEscape(item.value)+"\")'>";
		var alone=true;
		html+="<span class='punc'>\"</span>";
		if(item.displayValue) {
			html+=Xonomy.textByLang(item.displayValue);
			alone=false;
		} else {
			html+=Xonomy.xmlEscape(item.value);
			if(item.value) alone=false;
		}
		html+="<span class='punc'>\"</span>";
		if(item.caption!="") html+=" <span class='explainer "+(alone?"alone":"")+"'>"+Xonomy.xmlEscape(Xonomy.textByLang(item.caption))+"</span>";
		html+="</div>";
	}
	html+="</div>";
	return html;
},

wyc<T>(url: string, callback: (v: T) => string){ //a "when-you-can" function for delayed rendering: gets json from url, passes it to callback, and delayed-returns html-as-string from callback
	Xonomy.wycLastID++;
	var wycID="xonomy_wyc_"+Xonomy.wycLastID;
	if(Xonomy.wycCache[url]) return callback(Xonomy.wycCache[url]);
	$.ajax({url: url, dataType: "json", method: "POST"}).done(function(data: T){
			$("#"+wycID).replaceWith(callback(data));
			Xonomy.wycCache[url]=data;
	});
	return "<span class='wyc' id='"+wycID+"'></span>";
},

toggleSubmenu(menuItem: HTMLElement){
	var $menuItem=$(menuItem);
	if($menuItem.hasClass("expanded")){ $menuItem.find(".submenu").first().slideUp("fast", function(){$menuItem.removeClass("expanded");}); }
	else { $menuItem.find(".submenu").first().slideDown("fast", function(){$menuItem.addClass("expanded");}); };
},
/**
 * @param htmlID id of the node for which to render the menu
 * @param items menu options
 * @param 
 */
internalMenu(htmlID: string, items: XonomyMenuAction[], harvest: (el: HTMLElement) => XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance, getter: (indices: number[]) => string, indices: number[] = []) {
	Xonomy.harvestCache={};
	var jsMe=harvest(document.getElementById(htmlID));
	var fragments = items.map(function (item, i) {
		Xonomy.verifyDocSpecMenuItem(item);
		var includeIt=!item.hideIf(jsMe);
		var html="";
		if(includeIt) {
			indices.push(i);
			var icon=""; if(item.icon) icon="<span class='icon'><img src='"+item.icon+"'/></span> ";
			var key=""; if(item.keyTrigger && item.keyCaption) key="<span class='keyCaption'>"+Xonomy.textByLang(item.keyCaption)+"</span>";
			if (item.menu) {
				var internalHtml=Xonomy.internalMenu(htmlID, item.menu, harvest, getter, indices);
				if(internalHtml!="<div class='submenu'></div>") {
					html+="<div class='menuItem"+(item.expanded(jsMe)?" expanded":"")+"'>";
					html+="<div class='menuLabel focusme' tabindex='0' onkeydown='if(Xonomy.keyNav && [37, 39].indexOf(event.which)>-1) Xonomy.toggleSubmenu(this.parentNode)' onclick='Xonomy.toggleSubmenu(this.parentNode)'>"+icon+Xonomy.formatCaption(Xonomy.textByLang(item.caption(jsMe)))+"</div>";
					html+=internalHtml;
					html+="</div>";
				}
			} else {
				html+="<div class='menuItem focusme' tabindex='0' onclick='Xonomy.callMenuFunction("+getter(indices)+", \""+htmlID+"\")'>";
				html+=key+icon+Xonomy.formatCaption(Xonomy.textByLang(item.caption(jsMe)));
				html+="</div>";
			}
			indices.pop();
		}
		return html;
	});
	var cls = !indices.length ? 'menu' : 'submenu';
	return fragments.length
		? "<div class='"+cls+"'>"+fragments.join("")+"</div>"
		: "";
},
attributeMenu(htmlID: string){
	Xonomy.harvestCache={};
	var name=$("#"+htmlID).attr("data-name"); //obtain attribute's name
	var elName=$("#"+htmlID).closest(".element").attr("data-name"); //obtain element's name
	Xonomy.verifyDocSpecAttribute(elName, name);
	var spec=Xonomy.docSpec.elements[elName].attributes[name];
	function getter(indices: number[]) {
		return 'Xonomy.docSpec.elements["'+elName+'"].attributes["'+name+'"].menu['+indices.join('].menu[')+']';
	}
	return Xonomy.internalMenu(htmlID, spec.menu, Xonomy.harvestAttribute, getter);
},
elementMenu(htmlID: string) {
	Xonomy.harvestCache={};
	var elName=$("#"+htmlID).attr("data-name"); //obtain element's name
	var spec=Xonomy.docSpec.elements[elName];
	function getter(indices: number[]) {
		return 'Xonomy.docSpec.elements["'+elName+'"].menu['+indices.join('].menu[')+']';
	}
	return Xonomy.internalMenu(htmlID, spec.menu, Xonomy.harvestElement, getter);
},
inlineMenu(htmlID: string) {
	Xonomy.harvestCache={};
	var elName=$("#"+htmlID).attr("data-name"); //obtain element's name
	var spec=Xonomy.docSpec.elements[elName];
	function getter(indices: number[]) {
		return 'Xonomy.docSpec.elements["'+elName+'"].inlineMenu['+indices.join('].menu[')+']';
	}
	return Xonomy.internalMenu(htmlID, spec.inlineMenu, Xonomy.harvestElement, getter);
},
callMenuFunction(menuItem: XonomyMenuAction, htmlID: string) {
	menuItem.action(htmlID, menuItem.actionParameter);
},
formatCaption(caption: string) {
	caption=caption.replace(/\<(\/?)([^\>\/]+)(\/?)\>/g, "<span class='techno'><span class='punc'>&lt;$1</span><span class='elName'>$2</span><span class='punc'>$3&gt;</span></span>");
	caption=caption.replace(/\@"([^\"]+)"/g, "<span class='techno'><span class='punc'>\"</span><span class='atValue'>$1</span><span class='punc'>\"</span></span>");
	caption=caption.replace(/\@([^ =]+)=""/g, "<span class='techno'><span class='atName'>$1</span><span class='punc'>=\"</span><span class='punc'>\"</span></span>");
	caption=caption.replace(/\@([^ =]+)="([^\"]+)"/g, "<span class='techno'><span class='atName'>$1</span><span class='punc'>=\"</span><span class='atValue'>$2</span><span class='punc'>\"</span></span>");
	caption=caption.replace(/\@([^ =]+)/g, "<span class='techno'><span class='atName'>$1</span></span>");
	return caption;
},

deleteAttribute(htmlID: string, parameter: any) {
	Xonomy.clickoff();
	var obj=document.getElementById(htmlID);
	var parentID=obj.parentElement.parentElement.parentElement.id;
	obj.parentNode.removeChild(obj);
	Xonomy.changed();
	window.setTimeout(function(){ Xonomy.setFocus(parentID, "openingTagName"); }, 100);
},
deleteElement(htmlID: string, parameter: any) {
	Xonomy.clickoff();
	var obj=document.getElementById(htmlID);
	var parentID=(obj.parentNode.parentNode as HTMLElement).id;
	$(obj).fadeOut(function(){
		var parentNode=obj.parentNode;
		parentNode.removeChild(obj);
		Xonomy.changed();
		if($(parentNode).closest(".layby").length==0) {
			window.setTimeout(function(){ Xonomy.setFocus(parentID, "openingTagName");  }, 100);
		}
	});
},
newAttribute(htmlID: string, parameter: {name: string, value: string}) {
	Xonomy.clickoff();
	var $element=$("#"+htmlID);
	var html=Xonomy.renderAttribute({type: "attribute", name: parameter.name, value: parameter.value}, $element.data("name"));
	$("#"+htmlID+" > .tag.opening > .attributes").append(html);
	Xonomy.changed();
	//if the attribute we have just added is shy, force rollout:
	if($("#"+htmlID+" > .tag.opening > .attributes").children("[data-name='"+parameter.name+"'].shy").toArray().length>0) {
		if( !$("#"+htmlID).children(".tag.opening").children(".rollouter").hasClass("rolledout") ) {
			$("#"+htmlID).children(".tag.opening").children(".rollouter").addClass("rolledout");
			$("#"+htmlID).children(".tag.opening").children(".attributes").addClass("rolledout").hide().slideDown("fast");
		}
	}
	if(parameter.value=="") Xonomy.click($(html).prop("id"), "attributeValue"); else Xonomy.setFocus($(html).prop("id"), "attributeValue");
},
newElementChild(htmlID: string, parameter: string|Document) {
	Xonomy.clickoff();
	var jsElement=Xonomy.harvestElement(document.getElementById(htmlID));
	var html=Xonomy.renderElement(Xonomy.xml2js(parameter, jsElement));
	var $html=$(html).hide();
	$("#"+htmlID+" > .children").append($html);
	Xonomy.plusminus(htmlID, true);
	Xonomy.elementReorder($html.attr("id"));
	Xonomy.changed();
	$html.fadeIn();
	window.setTimeout(function(){ Xonomy.setFocus($html.prop("id"), "openingTagName"); }, 100);
},
elementReorder(htmlID: string){
	var that=document.getElementById(htmlID);
	var elSpec=Xonomy.docSpec.elements[that.getAttribute("data-name")];
	if(elSpec.mustBeBefore) { //is it after an element it cannot be after? then move it up until it's not!
		var $this=$(that);
		var jsElement=Xonomy.harvestElement(that);
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
		var jsElement=Xonomy.harvestElement(that);
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
},
newElementBefore(htmlID: string, parameter: string|Document) {
	Xonomy.clickoff();
	var jsElement=Xonomy.harvestElement(document.getElementById(htmlID));
	var html=Xonomy.renderElement(Xonomy.xml2js(parameter, jsElement.parent()));
	var $html=$(html).hide();
	$("#"+htmlID).before($html);
	Xonomy.elementReorder($html.prop("id"));
	Xonomy.changed();
	$html.fadeIn();
	window.setTimeout(function(){ Xonomy.setFocus($html.prop("id"), "openingTagName"); }, 100);
},
newElementAfter(htmlID: string, parameter: string|Document) {
	Xonomy.clickoff();
	var jsElement=Xonomy.harvestElement(document.getElementById(htmlID));
	var html=Xonomy.renderElement(Xonomy.xml2js(parameter, jsElement.parent()));
	var $html=$(html).hide();
	$("#"+htmlID).after($html);
	Xonomy.elementReorder($html.prop("id"));
	Xonomy.changed();
	$html.fadeIn();
	window.setTimeout(function(){ Xonomy.setFocus($html.prop("id"), "openingTagName"); }, 100);
},
replace(htmlID: string, jsNode: XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance) {
	var what=Xonomy.currentFocus;
	Xonomy.clickoff();
	var html="";
	if(jsNode.type=="element") html=Xonomy.renderElement(jsNode);
	if(jsNode.type=="attribute") html=Xonomy.renderAttribute(jsNode);
	if(jsNode.type=="text") html=Xonomy.renderText(jsNode);
	$("#"+htmlID).replaceWith(html);
	Xonomy.changed();
	window.setTimeout(function(){ Xonomy.setFocus($(html).prop("id"), what); }, 100);
},
// TODO document this
editRaw(htmlID: string, parameter: {
	fromJs(inst: XonomyElementInstance): string, 
	fromXml(xml: string): string
	toJs(val: string, jsElement: XonomyElementInstance): XonomyElementInstance,
	toXml(val: string, jsElement: XonomyElementInstance): string
}) {
	var div=document.getElementById(htmlID);
	var jsElement: XonomyElementInstance=Xonomy.harvestElement(div);
	if(parameter.fromJs) var txt=parameter.fromJs( jsElement );
	else if(parameter.fromXml) var txt=parameter.fromXml( Xonomy.js2xml(jsElement) );
	else var txt=Xonomy.js2xml(jsElement);
	document.body.appendChild(Xonomy.makeBubble(Xonomy.askLongString(txt))); //create bubble
	Xonomy.showBubble($(div)); //anchor bubble to element
	Xonomy.answer=function(val: string) {
		var jsNewElement;
		if(parameter.toJs) jsNewElement=parameter.toJs(val, jsElement);
		else if(parameter.toXml) jsNewElement=Xonomy.xml2js(parameter.toXml(val, jsElement), jsElement.parent());
		else jsNewElement=Xonomy.xml2js(val, jsElement.parent());

		var obj=document.getElementById(htmlID);
		var html=Xonomy.renderElement(jsNewElement);
		$(obj).replaceWith(html);
		Xonomy.clickoff();
		Xonomy.changed();
		window.setTimeout(function(){ Xonomy.setFocus($(html).prop("id"), "openingTagName"); }, 100);
	};
},
duplicateElement(htmlID: string) {
	Xonomy.clickoff();
	var html=document.getElementById(htmlID).outerHTML;
		  html=html.replace(/ id=['"]/g, function(x){return x+"d_"});
		  html=html.replace(/Xonomy\.click\(['"]/g, function(x){return x+"d_"});
		  html=html.replace(/Xonomy\.plusminus\(['"]/g, function(x){return x+"d_"});
	var $html=$(html).hide();
	$("#"+htmlID).after($html);
	Xonomy.changed();
	$html.fadeIn();
	window.setTimeout(function(){ Xonomy.setFocus($html.prop("id"), "openingTagName"); }, 100);
},
moveElementUp(htmlID: string){
	Xonomy.clickoff();
	var $me=$("#"+htmlID);
	if($me.closest(".layby > .content").length==0) {
		Xonomy.insertDropTargets(htmlID);
		var $droppers=$(".xonomy .elementDropper").add($me);
		var i=$droppers.index($me[0])-1;
		if(i>=0) {
			$($droppers[i]).replaceWith($me);
			Xonomy.changed();
			$me.hide().fadeIn();
		}
		Xonomy.dragend();
	}
	window.setTimeout(function(){ Xonomy.setFocus(htmlID, "openingTagName"); }, 100);
},
moveElementDown(htmlID: string){
	Xonomy.clickoff();
	var $me=$("#"+htmlID);
	if($me.closest(".layby > .content").length==0) {
		Xonomy.insertDropTargets(htmlID);
		var $droppers=$(".xonomy .elementDropper").add($me);
		var i=$droppers.index($me[0])+1;
		if(i<$droppers.length) {
			$($droppers[i]).replaceWith($me);
			Xonomy.changed();
			$me.hide().fadeIn();
		}
		Xonomy.dragend();
	}
	window.setTimeout(function(){ Xonomy.setFocus(htmlID, "openingTagName"); }, 100);
},
canMoveElementUp(htmlID: string){
	var ret=false;
	var $me=$("#"+htmlID);
	if($me.closest(".layby > .content").length==0) {
		Xonomy.insertDropTargets(htmlID);
		var $droppers=$(".xonomy .elementDropper").add($me);
		var i=$droppers.index($me[0])-1;
		if(i>=0) ret=true;
		Xonomy.dragend();
	}
	return ret;
},
canMoveElementDown(htmlID: string){
	var ret=false;
	var $me=$("#"+htmlID);
	if($me.closest(".layby > .content").length==0) {
		Xonomy.insertDropTargets(htmlID);
		var $droppers=$(".xonomy .elementDropper").add($me);
		var i=$droppers.index($me[0])+1;
		if(i<$droppers.length) ret=true;
		Xonomy.dragend();
	}
	return ret;
},
mergeWithPrevious(htmlID: string, parameter: any){
	var domDead=document.getElementById(htmlID);
	var elDead=Xonomy.harvestElement(domDead);
	var elLive=elDead.getPrecedingSibling();
	Xonomy.mergeElements(elDead, elLive);
},
mergeWithNext(htmlID: string, parameter: any){
	var domDead=document.getElementById(htmlID);
	var elDead=Xonomy.harvestElement(domDead);
	var elLive=elDead.getFollowingSibling();
	Xonomy.mergeElements(elDead, elLive);
},
mergeElements(elDead: XonomyElementInstance, elLive: XonomyElementInstance){
	Xonomy.clickoff();
	var domDead=document.getElementById(elDead.htmlID);
	if(elLive && elLive.type=="element") {
		for(var i=0; i<elDead.attributes.length; i++){ //merge attributes
			var atDead=elDead.attributes[i];
			if(!elLive.hasAttribute(atDead.name) || elLive.getAttributeValue(atDead.name)==""){
				elLive.setAttribute(atDead.name, atDead.value);
				if(elLive.hasAttribute(atDead.name)) $("#"+elLive.getAttribute(atDead.name).htmlID).remove();
				$("#"+elLive.htmlID).find(".attributes").first().append($("#"+elDead.attributes[i].htmlID));
			}
		}
		var specDead=Xonomy.docSpec.elements[elDead.name];
		var specLive=Xonomy.docSpec.elements[elLive.name];
		if(specDead.hasText(elDead) || specLive.hasText(elLive)){ //if either element is meant to have text, concatenate their children
			if(elLive.getText()!="" && elDead.getText()!="") {
				elLive.addText(" ");
				$("#"+elLive.htmlID).find(".children").first().append(Xonomy.renderText({type: "text", value: " "}));
			}
			for(var i=0; i<elDead.children.length; i++) {
				elLive.children.push(elDead.children[i]);
				$("#"+elLive.htmlID).find(".children").first().append($("#"+elDead.children[i].htmlID));
			}
		} else { //if no text, merge their children one by one
			for(var i=0; i<elDead.children.length; i++){
				var xmlDeadChild=Xonomy.js2xml(elDead.children[i]);
				var has=false;
				for(var y=0; y<elLive.children.length; y++){
					var xmlLiveChild=Xonomy.js2xml(elLive.children[y]);
					if(xmlDeadChild==xmlLiveChild){ has=true; break; }
				}
				if(!has) {
					elLive.children.push(elDead.children[i]);
					$("#"+elLive.htmlID).find(".children").first().append($("#"+elDead.children[i].htmlID));
					Xonomy.elementReorder(elDead.children[i].htmlID);
				}
			}
		}
		domDead.parentNode.removeChild(domDead);
		Xonomy.changed();
		window.setTimeout(function(){ Xonomy.setFocus(elLive.htmlID, "openingTagName"); }, 100);
	} else {
		window.setTimeout(function(){ Xonomy.setFocus(elDead.htmlID, "openingTagName"); }, 100);
	}
},
deleteEponymousSiblings(htmlID: string, parameter: any) {
	var what=Xonomy.currentFocus;
	Xonomy.clickoff();
	var obj=document.getElementById(htmlID);
	var parent=obj.parentNode.parentNode;
	var _htmlChildren=$(parent).children(".children").toArray()[0].childNodes;
	var htmlChildren=[]; for(var i=0; i<_htmlChildren.length; i++) htmlChildren.push(_htmlChildren[i]);
	for(var i=0; i<htmlChildren.length; i++) {
		var htmlChild=htmlChildren[i];
		if($(htmlChild).hasClass("element")) {
			if($(htmlChild).attr("data-name")==$(obj).attr("data-name") && htmlChild!=obj){
				htmlChild.parentNode.removeChild(htmlChild);
			}
		}
	}
	Xonomy.changed();
	window.setTimeout(function(){ Xonomy.setFocus(htmlID, what);  }, 100);
},

insertDropTargets(htmlID: string){
	var $element=$("#"+htmlID);
	$element.addClass("dragging");
	var elementName=$element.attr("data-name");
	var elSpec=Xonomy.docSpec.elements[elementName];
	$(".xonomy .element:visible > .children").append("<div class='elementDropper' ondragover='Xonomy.dragOver(event)' ondragleave='Xonomy.dragOut(event)' ondrop='Xonomy.drop(event)'><div class='inside'></div></div>")
	$(".xonomy .element:visible > .children > .element").before("<div class='elementDropper' ondragover='Xonomy.dragOver(event)' ondragleave='Xonomy.dragOut(event)' ondrop='Xonomy.drop(event)'><div class='inside'></div></div>")
	$(".xonomy .element:visible > .children > .text").before("<div class='elementDropper' ondragover='Xonomy.dragOver(event)' ondragleave='Xonomy.dragOut(event)' ondrop='Xonomy.drop(event)'><div class='inside'></div></div>")
	$(".xonomy .dragging .children:visible > .elementDropper").remove(); //remove drop targets fom inside the element being dragged
	$(".xonomy .dragging").prev(".elementDropper").remove(); //remove drop targets from immediately before the element being dragged
	$(".xonomy .dragging").next(".elementDropper").remove(); //remove drop targets from immediately after the element being dragged
	$(".xonomy .children:visible > .element.readonly .elementDropper").remove(); //remove drop targets from inside read-only elements

	var harvestCache: Record<string, XonomyElementInstance>={};
	var harvestElement=function(div: HTMLElement){
		var htmlID=$(div).prop("id");
		if(!harvestCache[htmlID]) harvestCache[htmlID]=Xonomy.harvestElement(div);
		return harvestCache[htmlID];
	};

	if(elSpec.localDropOnly(harvestElement($element.toArray()[0]))) {
		if(elSpec.canDropTo) { //remove the drop target from elements that are not the dragged element's parent
			var droppers=$(".xonomy .elementDropper").toArray();
			for(var i=0; i<droppers.length; i++) {
				var dropper=droppers[i];
				if(dropper.parentNode!=$element.get(0).parentNode.parentNode.parentNode) {
					dropper.parentNode.removeChild(dropper);
				}
			}
		}
	}
	if(elSpec.canDropTo) { //remove the drop target from elements it cannot be dropped into
		var droppers=$(".xonomy .elementDropper").toArray();
		for(var i=0; i<droppers.length; i++) {
			var dropper=droppers[i];
			var parentElementName=dropper.parentElement.parentElement.getAttribute("data-name");
			if($.inArray(parentElementName, elSpec.canDropTo)<0) {
				dropper.parentNode.removeChild(dropper);
			}
		}
	}
	if(elSpec.mustBeBefore) { //remove the drop target from after elements it cannot be after
		var jsElement=harvestElement($element.toArray()[0]);
		var droppers=$(".xonomy .elementDropper").toArray();
		for(var i=0; i<droppers.length; i++) {
			var dropper=droppers[i];
			jsElement.internalParent=harvestElement(dropper.parentElement.parentElement); //pretend the element's parent is the dropper's parent
			var mustBeBefore=elSpec.mustBeBefore(jsElement);
			for(var ii=0; ii<mustBeBefore.length; ii++) {
				if( $(dropper).prevAll("*[data-name='"+mustBeBefore[ii]+"']").toArray().length>0 ) {
					dropper.parentNode.removeChild(dropper);
				}
			}
		}
	}
	if(elSpec.mustBeAfter) { //remove the drop target from before elements it cannot be before
		var jsElement=harvestElement($element.toArray()[0]);
		var droppers=$(".xonomy .elementDropper").toArray();
		for(var i=0; i<droppers.length; i++) {
			var dropper=droppers[i];
			jsElement.internalParent=harvestElement(dropper.parentElement.parentElement); //pretend the element's parent is the dropper's parent
			var mustBeAfter=elSpec.mustBeAfter(jsElement);
			for(var ii=0; ii<mustBeAfter.length; ii++) {
				if( $(dropper).nextAll("*[data-name='"+mustBeAfter[ii]+"']").toArray().length>0 ) {
					dropper.parentNode.removeChild(dropper);
				}
			}
		}
	}
},

drag(ev: DragEvent) { //called when dragging starts
	// Wrapping all the code into a timeout handler is a workaround for a Chrome browser bug
	// (if the DOM is manipulated in the 'dragStart' event then 'dragEnd' event is sometimes fired immediately)
	//
	// for more details @see:
	//   http://stackoverflow.com/questions/19639969/html5-dragend-event-firing-immediately
	ev.dataTransfer.effectAllowed="move"; //only allow moving (and not eg. copying]
	var htmlID=(ev.target as HTMLElement).parentElement.parentElement.id;
	ev.dataTransfer.setData("text", htmlID);
	setTimeout(function() {
		Xonomy.clickoff();
		Xonomy.insertDropTargets(htmlID);
		Xonomy.draggingID=htmlID;
		Xonomy.refresh();
	}, 10);
},
dragOver(ev: DragEvent) {
	ev.preventDefault();
	ev.dataTransfer.dropEffect="move"; //only allow moving (and not eg. copying]
	if($(ev.currentTarget).hasClass("layby")){
		$(ev.currentTarget).addClass("activeDropper");
	} else {
		$((ev.target as HTMLElement).parentNode).addClass("activeDropper");
	}
},
dragOut(ev: DragEvent) {
	ev.preventDefault();
	if($(ev.currentTarget).hasClass("layby")){
		$(ev.currentTarget).removeClass("activeDropper");
	} else {
		$(".xonomy .activeDropper").removeClass("activeDropper");
	}
},
drop(ev: DragEvent) {
	ev.preventDefault();
	var node=document.getElementById(Xonomy.draggingID); //the thing we are moving
	if($(ev.currentTarget).hasClass("layby")) {
		$(node).hide();
		$(".xonomy .layby > .content").append(node);
		$(node).fadeIn(function(){ Xonomy.changed(); });
	} else {
		$(node).hide();
		$((ev.target as HTMLElement).parentNode).replaceWith(node);
		$(node).fadeIn(function(){ Xonomy.changed(); });
	}
	Xonomy.openCloseLayby();
	Xonomy.recomputeLayby();
},
dragend(ev?: JQuery.DragEndEvent) {
	$(".xonomy .attributeDropper").remove();
	$(".xonomy .elementDropper").remove();
	$(".xonomy .dragging").removeClass("dragging");
	Xonomy.refresh();
	$(".xonomy .layby").removeClass("activeDropper");
},

openCloseLayby(){ //open the layby if it's full, close it if it's empty
	if($(".xonomy .layby > .content > *").length>0){
		$(".xonomy .layby").removeClass("closed").addClass("open");
	} else {
		$(".xonomy .layby").removeClass("open").addClass("closed");
	}
},
openLayby(){
	$(".xonomy .layby").removeClass("closed").addClass("open");
},
closeLayby(){
	window.setTimeout(function(){
		$(".xonomy .layby").removeClass("open").addClass("closed");
	}, 10);
},
emptyLayby(){
	$(".xonomy .layby .content").html("");
	$(".xonomy .layby").removeClass("nonempty").addClass("empty");
},
recomputeLayby(){
	if($(".xonomy .layby > .content > *").length>0){
		$(".xonomy .layby").removeClass("empty").addClass("nonempty");
	} else {
		$(".xonomy .layby").removeClass("nonempty").addClass("empty");
	}
},
newElementLayby(xml: string|Document) {
	Xonomy.clickoff();
	var html=Xonomy.renderElement(Xonomy.xml2js(xml));
	var $html=$(html).hide();
	$(".xonomy .layby > .content").append($html);
	Xonomy.refresh();
	$html.fadeIn();
	Xonomy.openCloseLayby();
	Xonomy.recomputeLayby();
},

changed(jsElement?: XonomyElementInstance|XonomyAttributeInstance|XonomyTextInstance) { //called when the document changes
	Xonomy.harvestCache={};
	Xonomy.refresh();
	Xonomy.validate();
	Xonomy.docSpec.onchange(jsElement); //report that the document has changed
},
validate() {
	var js=Xonomy.harvestElement($(".xonomy .element").toArray()[0], null);
	$(".xonomy .invalid").removeClass("invalid");
	Xonomy.warnings=[];
	Xonomy.docSpec.validate(js); //validate the document
	for(var iWarning=0; iWarning<Xonomy.warnings.length; iWarning++) {
		var warning=Xonomy.warnings[iWarning];
		$("#"+warning.htmlID).addClass("invalid");
	}
},


textByLang(str: string) {
	//str = eg. "en: Delete | de: Löschen | fr: Supprimer"
	if(!str) str="";
	var ret=str;
	var segs=str.split("|");
	for(var i=0; i<segs.length; i++) {
		var seg=$.trim(segs[i]);
		if(seg.indexOf(Xonomy.lang+":")==0) {
			ret=seg.substring((Xonomy.lang+":").length, ret.length);
		}
	}
	ret=$.trim(ret);
	return ret;
},


startKeyNav(keyboardEventCatcher: string|HTMLElement, scrollableContainer: string|HTMLElement){
	Xonomy.keyNav=true;
	var $keyboardEventCatcher=$(keyboardEventCatcher as any); if(!keyboardEventCatcher) $keyboardEventCatcher=$(".xonomy");
	var $scrollableContainer=$(scrollableContainer as any); if(!scrollableContainer) $scrollableContainer=$keyboardEventCatcher;
	$keyboardEventCatcher.attr("tabindex", "0");
	$keyboardEventCatcher.on("keydown", Xonomy.key);
	$(document).on("keydown", function(e) { if([32, 37, 38, 39, 40].indexOf(e.keyCode)>-1 && $("input:focus, select:focus, textarea:focus").length==0) e.preventDefault(); }); //prevent default browser scrolling on arrow keys
	Xonomy.keyboardEventCatcher=$keyboardEventCatcher;
	Xonomy.scrollableContainer=$scrollableContainer;
},
setFocus(htmlID: string, what: XonomyWhat){
	if(Xonomy.keyNav) {
		$(".xonomy .current").removeClass("current");
		$(".xonomy .focused").removeClass("focused");
		if(what=="attributeValue") $("#"+htmlID+" > .valueContainer").addClass("current").addClass("focused");
		else $("#"+htmlID).addClass("current").addClass("focused");
		Xonomy.currentHtmlId=htmlID;
		Xonomy.currentFocus=what;
		if(Xonomy.currentFocus=="openingTagName") $("#"+htmlID+" > .tag.opening").first().addClass("focused");
		if(Xonomy.currentFocus=="closingTagName") $("#"+htmlID+" > .tag.closing").last().addClass("focused");
		if(Xonomy.currentFocus=="childrenCollapsed") $("#"+htmlID+" > .childrenCollapsed").last().addClass("focused");
		if(Xonomy.currentFocus=="rollouter") $("#"+htmlID+" > .tag.opening > .rollouter").last().addClass("focused");
	}
},
key(event: JQuery.Event){
	if(!Xonomy.notKeyUp) {
		if(!event.shiftKey && !$("#xonomyBubble").length ) {
			if(event.which==27) { //escape key
				event.preventDefault();
				event.stopImmediatePropagation();
				Xonomy.destroyBubble();
			} else if(event.which==13){ //enter key
				event.preventDefault();
				event.stopImmediatePropagation();
				if(Xonomy.currentFocus=="childrenCollapsed") Xonomy.plusminus(Xonomy.currentHtmlId, true);
				else {
					Xonomy.click(Xonomy.currentHtmlId, Xonomy.currentFocus);
					Xonomy.clickoff();
				}
			} else if((event.ctrlKey || event.metaKey) && event.which==40) { //down key with Ctrl or Cmd (Mac OS)
				event.preventDefault();
				event.stopImmediatePropagation();
				Xonomy.scrollableContainer.scrollTop( Xonomy.scrollableContainer.scrollTop()+60 );
			} else if((event.ctrlKey || event.metaKey) && event.which==38) { //up key with Ctrl or Cmd (Mac OS)
				event.preventDefault();
				event.stopImmediatePropagation();
				Xonomy.scrollableContainer.scrollTop( Xonomy.scrollableContainer.scrollTop()-60 );
			} else if((event.ctrlKey || event.metaKey) && [37, 39].indexOf(event.which)>-1) { //arrow keys with Ctrl or Cmd (Mac OS)
				event.preventDefault();
				event.stopImmediatePropagation();
				var $el=$("#"+Xonomy.currentHtmlId);
				if($el.hasClass("element") && !$el.hasClass("uncollapsible")){
					if(event.which==39 && $el.hasClass("collapsed")) { //expand it!
						Xonomy.plusminus(Xonomy.currentHtmlId);
					}
					if(event.which==37 && !$el.hasClass("collapsed")) { //collapse it!
						Xonomy.plusminus(Xonomy.currentHtmlId);
					}
				}
			} else if([37, 38, 39, 40].indexOf(event.which)>-1 && !event.altKey) { //arrow keys
				event.preventDefault();
				event.stopImmediatePropagation();
				if(!Xonomy.currentHtmlId) { //nothing is current yet
					Xonomy.setFocus($(".xonomy .element").first().prop("id"), "openingTagName");
				} else if($(".xonomy .focused").length==0) { //something is current but nothing is focused yet
					Xonomy.setFocus(Xonomy.currentHtmlId, Xonomy.currentFocus);
				} else { //something is current, do arrow action
					if(event.which==40) Xonomy.goDown(); //down key
					if(event.which==38) Xonomy.goUp(); //up key
					if(event.which==39) Xonomy.goRight(); //right key
					if(event.which==37) Xonomy.goLeft(); //left key
				}
			}
		} else if(!$("#xonomyBubble").length) {
			Xonomy.keyboardMenu(event);
		} else {
			// There's an edit widget (xonomyBubble) open right now.
			if (event.which == 13 && event.ctrlKey) {
				// Ctrl+Enter submits.
				event.preventDefault();
				event.stopImmediatePropagation();
				$("#xonomyBubble form").trigger('submit');
			}
		}
	}
	Xonomy.notKeyUp=false;
},
keyboardMenu(event: JQuery.Event){
	Xonomy.harvestCache={};
	var $obj=$("#"+Xonomy.currentHtmlId);
	var jsMe: null|XonomyElementInstance|XonomyAttributeInstance=null;
	var menu=null;
	if($obj.hasClass("element")){
		jsMe=Xonomy.harvestElement($obj[0]);
		var elName=$obj.attr("data-name");
		menu=Xonomy.docSpec.elements[elName].menu;
	} else if($obj.hasClass("attribute")) {
		jsMe=Xonomy.harvestAttribute($obj[0]);
		var atName=$obj.attr("data-name");
		var elName=$obj.closest(".element").attr("data-name");
		menu=Xonomy.docSpec.elements[elName].attributes[atName].menu;
	}
	if(menu){
		Xonomy.harvestCache={};
		var findMenuItem=function(menu: XonomyMenuAction[]): null|XonomyMenuAction {
			var ret=null;
			for(var i=0; i<menu.length; i++){
				if(menu[i].menu) ret=findMenuItem(menu[i].menu);
				else if(menu[i].keyTrigger && !menu[i].hideIf(jsMe) && menu[i].keyTrigger(event)) ret=menu[i];
				if(ret) break;
			}
			return ret;
		};
		var menuItem=findMenuItem(menu);
		if(menuItem) {
			Xonomy.callMenuFunction(menuItem, Xonomy.currentHtmlId);
			Xonomy.clickoff();
			return true;
		}
	}
	return false;
},

goDown(){
	if(Xonomy.currentFocus!="openingTagName" && Xonomy.currentFocus!="closingTagName" && Xonomy.currentFocus!="text") {
		Xonomy.goRight();
	} else {
		var $el=$("#"+Xonomy.currentHtmlId);
		var $me=$el;
		if(Xonomy.currentFocus=="openingTagName") var $me=$el.find(".tag.opening").first();
		if(Xonomy.currentFocus=="closingTagName") var $me=$el.find(".tag.closing").last();

		var $candidates=$(".xonomy .focusable:visible").not(".attributeName").not(".attributeValue").not(".childrenCollapsed").not(".rollouter");
		$candidates=$candidates.add($el);
		if(Xonomy.currentFocus=="openingTagName" && $el.hasClass("oneliner")) $candidates=$candidates.not("#"+Xonomy.currentHtmlId+" .tag.closing").not("#"+Xonomy.currentHtmlId+" .children *");
		if(Xonomy.currentFocus=="openingTagName" && $el.hasClass("oneliner")) $candidates=$candidates.not("#"+Xonomy.currentHtmlId+" .textnode");
		if($el.hasClass("collapsed")) $candidates=$candidates.not("#"+Xonomy.currentHtmlId+" .tag.closing");
		if($el.hasClass("textnode") && $(".xonomy").hasClass("nerd")) var $candidates=$el.closest(".element").find(".tag.closing").last();
		if($el.hasClass("textnode") && $(".xonomy").hasClass("laic")) var $candidates=$el.closest(".element").next().find(".focusable:visible").first();

		var $next=$candidates.eq( $candidates.index($me[0])+1 );
		if($next.hasClass("opening")) Xonomy.setFocus($next.closest(".element").prop("id"), "openingTagName");
		if($next.hasClass("closing")) Xonomy.setFocus($next.closest(".element").prop("id"), "closingTagName");
		if($next.hasClass("textnode")) Xonomy.setFocus($next.prop("id"), "text");
	}
},
goUp(){
	if(Xonomy.currentFocus!="openingTagName" && Xonomy.currentFocus!="closingTagName" && Xonomy.currentFocus!="text") {
		Xonomy.goLeft();
	} else {
		var $el=$("#"+Xonomy.currentHtmlId);
		var $me=$el;
		if(Xonomy.currentFocus=="openingTagName") var $me=$el.find(".tag.opening").first();
		if(Xonomy.currentFocus=="closingTagName") var $me=$el.find(".tag.closing").last();

		var $candidates=$(".xonomy .focusable:visible").not(".attributeName").not(".attributeValue").not(".childrenCollapsed").not(".rollouter");
		$candidates=$candidates.not(".element .oneliner .tag.closing");
		$candidates=$candidates.not(".element .oneliner .textnode");
		$candidates=$candidates.not(".element .collapsed .tag.closing");
		if($el.hasClass("textnode")) var $candidates=$el.closest(".element").find(".tag.opening").first().add($el);
		if($me.hasClass("closing") && $el.hasClass("hasText")) $candidates=$candidates.not("#"+Xonomy.currentHtmlId+" .children *:not(:first-child)");
		if($me.hasClass("opening") && $el.closest(".element").prev().hasClass("hasText")) {
			var siblingID=$el.closest(".element").prev().prop("id");
			$candidates=$candidates.not("#"+siblingID+" .children *:not(:first-child)");
		}

		if($candidates.index($me[0])>0) {
			var $next=$candidates.eq( $candidates.index($me[0])-1 );
			if($next.hasClass("opening")) Xonomy.setFocus($next.closest(".element").prop("id"), "openingTagName");
			if($next.hasClass("closing")) Xonomy.setFocus($next.closest(".element").prop("id"), "closingTagName");
			if($next.hasClass("textnode")) Xonomy.setFocus($next.prop("id"), "text");
		}
	}
},
goRight(){
	var $el=$("#"+Xonomy.currentHtmlId);
	var $me=$el;
	if(Xonomy.currentFocus=="openingTagName") var $me=$el.find(".tag.opening").first();
	if(Xonomy.currentFocus=="closingTagName") var $me=$el.find(".tag.closing").last();
	if(Xonomy.currentFocus=="attributeName") var $me=$el.find(".attributeName").first();
	if(Xonomy.currentFocus=="attributeValue") var $me=$el.find(".attributeValue").first();
	if(Xonomy.currentFocus=="childrenCollapsed") var $me=$el.find(".childrenCollapsed").first();
	if(Xonomy.currentFocus=="rollouter") var $me=$el.find(".rollouter").first();

	var $candidates=$(".xonomy .focusable:visible");

	var $next=$candidates.eq( $candidates.index($me[0])+1 );
	if($next.hasClass("attributeName")) Xonomy.setFocus($next.closest(".attribute").prop("id"), "attributeName");
	if($next.hasClass("attributeValue")) Xonomy.setFocus($next.closest(".attribute").prop("id"), "attributeValue");
	if($next.hasClass("opening")) Xonomy.setFocus($next.closest(".element").prop("id"), "openingTagName");
	if($next.hasClass("closing")) Xonomy.setFocus($next.closest(".element").prop("id"), "closingTagName");
	if($next.hasClass("textnode")) Xonomy.setFocus($next.prop("id"), "text");
	if($next.hasClass("childrenCollapsed")) Xonomy.setFocus($next.closest(".element").prop("id"), "childrenCollapsed");
	if($next.hasClass("rollouter")) Xonomy.setFocus($next.closest(".element").prop("id"), "rollouter");
},
goLeft(){
	var $el=$("#"+Xonomy.currentHtmlId);
	var $me=$el;
	if(Xonomy.currentFocus=="openingTagName") var $me=$el.find(".tag.opening").first();
	if(Xonomy.currentFocus=="closingTagName") var $me=$el.find(".tag.closing").last();
	if(Xonomy.currentFocus=="attributeName") var $me=$el.find(".attributeName").first();
	if(Xonomy.currentFocus=="attributeValue") var $me=$el.find(".attributeValue").first();
	if(Xonomy.currentFocus=="childrenCollapsed") var $me=$el.find(".childrenCollapsed").first();
	if(Xonomy.currentFocus=="rollouter") var $me=$el.find(".rollouter").first();

	var $candidates=$(".xonomy .focusable:visible");

	var $next=$candidates.eq( $candidates.index($me[0])-1 );
	if($next.hasClass("attributeName")) Xonomy.setFocus($next.closest(".attribute").prop("id"), "attributeName");
	if($next.hasClass("attributeValue")) Xonomy.setFocus($next.closest(".attribute").prop("id"), "attributeValue");
	if($next.hasClass("opening")) Xonomy.setFocus($next.closest(".element").prop("id"), "openingTagName");
	if($next.hasClass("closing")) Xonomy.setFocus($next.closest(".element").prop("id"), "closingTagName");
	if($next.hasClass("textnode")) Xonomy.setFocus($next.prop("id"), "text");
	if($next.hasClass("childrenCollapsed")) Xonomy.setFocus($next.closest(".element").prop("id"), "childrenCollapsed");
	if($next.hasClass("rollouter")) Xonomy.setFocus($next.closest(".element").prop("id"), "rollouter");
},
}
