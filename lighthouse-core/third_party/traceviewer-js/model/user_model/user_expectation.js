"use strict";require("../../base/range_utils.js");require("../../base/statistics.js");require("../../base/unit.js");require("../compound_event_selection_state.js");require("../event_set.js");require("../timed_event.js");'use strict';global.tr.exportTo('tr.model.um',function(){var CompoundEventSelectionState=tr.model.CompoundEventSelectionState;function UserExpectation(parentModel,initiatorTitle,start,duration){tr.model.TimedEvent.call(this,start);this.associatedEvents=new tr.model.EventSet();this.duration=duration;this.initiatorTitle_=initiatorTitle;this.parentModel=parentModel;this.typeInfo_=undefined;this.sourceEvents=new tr.model.EventSet();}UserExpectation.prototype={__proto__:tr.model.TimedEvent.prototype,computeCompoundEvenSelectionState:function(selection){var cess=CompoundEventSelectionState.NOT_SELECTED;if(selection.contains(this))cess|=CompoundEventSelectionState.EVENT_SELECTED;if(this.associatedEvents.intersectionIsEmpty(selection))return cess;var allContained=this.associatedEvents.every(function(event){return selection.contains(event);});if(allContained)cess|=CompoundEventSelectionState.ALL_ASSOCIATED_EVENTS_SELECTED;else cess|=CompoundEventSelectionState.SOME_ASSOCIATED_EVENTS_SELECTED;return cess;},get associatedSamples(){var samples=new tr.model.EventSet();this.associatedEvents.forEach(function(event){if(event instanceof tr.model.ThreadSlice)samples.addEventSet(event.overlappingSamples);});return samples;},get userFriendlyName(){return this.title+' User Expectation at '+tr.b.Unit.byName.timeStampInMs.format(this.start);},get stableId(){return'UserExpectation.'+this.guid;},get typeInfo(){if(!this.typeInfo_){this.typeInfo_=UserExpectation.subTypes.findTypeInfo(this.constructor);}if(!this.typeInfo_)throw new Error('Unregistered UserExpectation');return this.typeInfo_;},get colorId(){return this.typeInfo.metadata.colorId;},get stageTitle(){return this.typeInfo.metadata.stageTitle;},get initiatorTitle(){return this.initiatorTitle_;},get title(){if(!this.initiatorTitle)return this.stageTitle;return this.initiatorTitle+' '+this.stageTitle;},get totalCpuMs(){var cpuMs=0;this.associatedEvents.forEach(function(event){if(event.cpuSelfTime)cpuMs+=event.cpuSelfTime;});return cpuMs;}};var subTypes={};var options=new tr.b.ExtensionRegistryOptions(tr.b.BASIC_REGISTRY_MODE);tr.b.decorateExtensionRegistry(subTypes,options);subTypes.addEventListener('will-register',function(e){var metadata=e.typeInfo.metadata;if(metadata.stageTitle===undefined){throw new Error('Registered UserExpectations must provide '+'stageTitle');}if(metadata.colorId===undefined){throw new Error('Registered UserExpectations must provide '+'colorId');}});tr.model.EventRegistry.register(UserExpectation,{name:'userExpectation',pluralName:'userExpectations',subTypes:subTypes});return{UserExpectation:UserExpectation};});