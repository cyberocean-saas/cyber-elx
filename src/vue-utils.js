const { compile } = require('vue-template-compiler');

function parseComponentJsCode(componentText) {
  var parsedComponent = eval(`(${componentText.replace("module.exports =", "")})`);
  for(var key of Object.keys(parsedComponent)) {
    parsedComponent[key] = parsedComponent[key]?.trim() || parsedComponent[key];
  }
  return parsedComponent;
}

function componentObjectToJsCode(component) {
  var newComponent = Object.keys(component).reduce((final, key) => {
    if(key == "compiledTemplate" || !component[key]) return final;
    final[key] = "#" + key.toUpperCase();
    return final;
  }, {});
  var jsCode = JSON.stringify(newComponent, null, 2);
  jsCode = jsCode.replace(/"/g, "");
  Object.keys(component).forEach(key => {
    if(key == "compiledTemplate" || !component[key]) return;
    var newContent = (typeof component[key] === "string") ? component[key] : JSON.stringify(component[key]);
    newContent = "\n" + newContent.trim();
    // Add Tabs
    newContent = "  " + newContent.replace(/\n/g, "\n    ");
    // Add comments
    if(key == "template") {
      newContent = "/* html */`" + newContent + "`";
    } else if(key == "name") {
      newContent = "\"" + newContent.trim() + "\"";
    } else  if(key == "props") {
      // Add nothing
    } else {
      newContent = "/* js */`" + newContent + "`";
    }
    // Replace
    jsCode = jsCode.replace("#" + key.toUpperCase(), newContent);
  });
  return "module.exports = " + jsCode;
}

/**
 * Compiles Vue template for a single component
 * @param {Object} component - Component definition with code.template
 * @returns {Object} - Same component with `compiledTemplate` added to code
 */
function compileComponentTemplates(component) {
  const compiled = compile(component.code.template);

  if (compiled.errors.length > 0) {
    console.warn(`Template compilation errors:`, compiled.errors);
  }

  return {
    ...component,
    code: {
      ...component.code,
      compiledTemplate: {
        render: compiled.render,
        staticRenderFns: compiled.staticRenderFns,
        errors: compiled.errors,
        tips: compiled.tips
      }
    }
  };
}

// function test() {
//   console.log('test +++++++');
//   var components = [
//     {
//       "name": "CardComponent",
//       "template": "\n        <div class=\"card-component\">\n          <h2>🎴 {{ title }}</h2>\n          <p>{{ description }}</p>\n          \n          <div style=\"margin: 20px 0;\">\n            <v-text-field \n              v-model=\"userInput\" \n              label=\"Type something...\"\n              variant=\"outlined\"\n              density=\"compact\"\n              style=\"max-width: 300px; display: inline-block;\"\n            />\n            <v-btn color=\"primary\" @click=\"incrementCounter\" class=\"ml-2\">\n              Clicked {{ counter }} times\n            </v-btn>\n          </div>\n          \n          <p v-if=\"userInput\">You typed: <strong>{{ userInput }}</strong></p>\n          \n          <div style=\"margin: 20px 0;\">\n            <h3>Default Slot:</h3>\n            <slot>\n              <p style=\"color: #999;\">No slot content provided</p>\n            </slot>\n          </div>\n          \n          <slot name=\"footer\"></slot>\n        </div>\n      ",
//       "data": "function() {\n        return {\n          title: 'Card Component',\n          description: 'This is a dynamically loaded CARD component with slots!',\n          counter: 0,\n          userInput: ''\n        };\n      }",
//       "computed": "{\n        doubleCounter() {\n          return this.counter * 2;\n        }\n      }",
//       "watch": "{\n        counter(newVal) {\n          console.log('Counter changed to:', newVal);\n        }\n      }",
//       "methods": "{\n        incrementCounter() {\n          this.counter++;\n        }\n      }",
//       "beforeCreate": null,
//       "created": null,
//       "beforeMount": null,
//       "mounted": "function() {\n        console.log('Card component mounted!');\n      }",
//       "beforeUpdate": null,
//       "updated": null,
//       "beforeDestroy": null,
//       "destroyed": null,
//       "compiledTemplate": {
//         "render": "with(this){return _c('div',{staticClass:\"card-component\"},[_c('h2',[_v(\"🎴 \"+_s(title))]),_v(\" \"),_c('p',[_v(_s(description))]),_v(\" \"),_c('div',{staticStyle:{\"margin\":\"20px 0\"}},[_c('v-text-field',{staticStyle:{\"max-width\":\"300px\",\"display\":\"inline-block\"},attrs:{\"label\":\"Type something...\",\"variant\":\"outlined\",\"density\":\"compact\"},model:{value:(userInput),callback:function ($$v) {userInput=$$v},expression:\"userInput\"}}),_v(\" \"),_c('v-btn',{staticClass:\"ml-2\",attrs:{\"color\":\"primary\"},on:{\"click\":incrementCounter}},[_v(\"\\n              Clicked \"+_s(counter)+\" times\\n            \")])],1),_v(\" \"),(userInput)?_c('p',[_v(\"You typed: \"),_c('strong',[_v(_s(userInput))])]):_e(),_v(\" \"),_c('div',{staticStyle:{\"margin\":\"20px 0\"}},[_c('h3',[_v(\"Default Slot:\")]),_v(\" \"),_t(\"default\",function(){return [_c('p',{staticStyle:{\"color\":\"#999\"}},[_v(\"No slot content provided\")])]})],2),_v(\" \"),_t(\"footer\")],2)}",
//         "staticRenderFns": [],
//         "errors": [],
//         "tips": []
//       }
//     },
//     {
//       "name": "ListComponent",
//       "template": "<div class=\"list-component\">\n  <h2>📋 {{ title }}</h2>\n  <p>{{ description }}</p>\n  \n  <div style=\"margin: 20px 0;\">\n    <v-text-field \n      v-model=\"newItem\" \n      @keyup.enter=\"addItem\"\n      label=\"Add new item...\"\n      variant=\"outlined\"\n      density=\"compact\"\n      style=\"max-width: 300px; display: inline-block;\"\n    />\n    <v-btn color=\"primary\" @click=\"addItem\" class=\"ml-2\">Add Item</v-btn>\n  </div>\n  \n  <v-list>\n    <v-list-item v-for=\"item in items\" :key=\"item.id\">\n      <v-list-item-title>{{ item.name }}</v-list-item-title>\n      <template v-slot:append>\n<v-btn color=\"error\" size=\"small\" @click=\"removeItem(item.id)\">Remove</v-btn>\n      </template>\n    </v-list-item>\n  </v-list>\n  \n  <div style=\"margin: 20px 0;\">\n    <h3>Default Slot:</h3>\n    <slot>\n      <p style=\"color: #999;\">No slot content provided</p>\n    </slot>\n  </div>\n  \n  <slot name=\"footer\"></slot>\n</div>\n      ",
//       "data": "function() {\nreturn {\n  title: 'List Component',\n  description: 'This is a dynamically loaded LIST component with slots!',\n  newItem: '',\n  items: [\n    { id: 1, name: 'Learn Vue.js' },\n    { id: 2, name: 'Build dynamic components' },\n    { id: 3, name: 'Master slots' }\n  ],\n  nextId: 4\n};\n      }",
//       "computed": "{\nitemCount() {\n  return this.items.length;\n}\n      }",
//       "watch": null,
//       "methods": "{\naddItem() {\n  if (this.newItem.trim()) {\n    this.items.push({\n      id: this.nextId++,\n      name: this.newItem\n    });\n    this.newItem = '';\n  }\n},\nremoveItem(id) {\n  this.items = this.items.filter(item => item.id !== id);\n}\n      }",
//       "beforeCreate": null,
//       "created": null,
//       "beforeMount": null,
//       "mounted": "function() {\nconsole.log('List component mounted!');\n      }",
//       "beforeUpdate": null,
//       "updated": null,
//       "beforeDestroy": null,
//       "destroyed": null,
//       "compiledTemplate": {
//         "render": "with(this){return _c('div',{staticClass:\"list-component\"},[_c('h2',[_v(\"📋 \"+_s(title))]),_v(\" \"),_c('p',[_v(_s(description))]),_v(\" \"),_c('div',{staticStyle:{\"margin\":\"20px 0\"}},[_c('v-text-field',{staticStyle:{\"max-width\":\"300px\",\"display\":\"inline-block\"},attrs:{\"label\":\"Add new item...\",\"variant\":\"outlined\",\"density\":\"compact\"},on:{\"keyup\":function($event){if(!$event.type.indexOf('key')&&_k($event.keyCode,\"enter\",13,$event.key,\"Enter\"))return null;return addItem.apply(null, arguments)}},model:{value:(newItem),callback:function ($$v) {newItem=$$v},expression:\"newItem\"}}),_v(\" \"),_c('v-btn',{staticClass:\"ml-2\",attrs:{\"color\":\"primary\"},on:{\"click\":addItem}},[_v(\"Add Item\")])],1),_v(\" \"),_c('v-list',_l((items),function(item){return _c('v-list-item',{key:item.id,scopedSlots:_u([{key:\"append\",fn:function(){return [_c('v-btn',{attrs:{\"color\":\"error\",\"size\":\"small\"},on:{\"click\":function($event){return removeItem(item.id)}}},[_v(\"Remove\")])]},proxy:true}],null,true)},[_c('v-list-item-title',[_v(_s(item.name))])],1)}),1),_v(\" \"),_c('div',{staticStyle:{\"margin\":\"20px 0\"}},[_c('h3',[_v(\"Default Slot:\")]),_v(\" \"),_t(\"default\",function(){return [_c('p',{staticStyle:{\"color\":\"#999\"}},[_v(\"No slot content provided\")])]})],2),_v(\" \"),_t(\"footer\")],2)}",
//         "staticRenderFns": [],
//         "errors": [],
//         "tips": []
//       }
//     }
//   ];

//   const fs = require('fs');

//   // Create components directory if it doesn't exist
//   if (!fs.existsSync('./components')) {
//     fs.mkdirSync('./components');
//   }

//   // For each component
//   for (const component of components) {
//     fs.writeFileSync(`./components/${component.name}.js`, componentObjectToJsCode(component));
//     fs.writeFileSync(`./components/${component.name}_clean.json`, JSON.stringify(parseComponentJsCode(componentObjectToJsCode(component)), null, 2));
//   }

// }

// test();


module.exports = { compileComponentTemplates, componentObjectToJsCode, parseComponentJsCode };