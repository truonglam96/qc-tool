(window.webpackJsonp = window.webpackJsonp || []).push([
	[0], {
		142: function(e, t, n) {
			e.exports = n(206)
		},
		173: function(e, t) {},
		200: function(e, t, n) {},
		206: function(e, t, n) {
			"use strict";
			n.r(t);
			var a = n(0),
				o = n.n(a),
				r = n(12),
				s = n.n(r),
				i = n(51),
				c = n(13),
				l = n(14),
				u = n(16),
				m = n(15),
				d = n(17),
				g = n(263),
				p = n(130),
				f = n(84),
				T = n.n(f),
				b = n(6),
				h = n(250),
				S = n(260),
				E = n(251),
				y = n(208),
				x = n(32),
				v = (n(55), n(56), n(57), n(2)),
				k = n(73),
				C = n(42),
				w = function(e) {
					function t(e) {
						var n;
						return Object(c.a)(this, t), (n = Object(u.a)(this, Object(m.a)(t).call(this, e))).state = {
							toolTipMs: null
						}, n
					}
					return Object(d.a)(t, e), Object(l.a)(t, [{
						key: "render",
						value: function() {
							var e = this;
							return o.a.createElement("div", {
								className: "p-2",
								style: this.props.style,
								onMouseEnter: function() {
									e.setState({
										toolTipMs: e.props.toolTipMs + "ms"
									})
								},
								onMouseLeave: function() {
									e.setState({
										toolTipMs: null
									})
								}
							}, this.state.toolTipMs)
						}
					}]), t
				}(o.a.Component),
				B = function(e) {
					function t() {
						var e, n;
						Object(c.a)(this, t);
						for (var a = arguments.length, r = new Array(a), s = 0; s < a; s++) r[s] = arguments[s];
						return (n = Object(u.a)(this, (e = Object(m.a)(t)).call.apply(e, [this].concat(r)))).renderNameButton = function(e) {
							return e ? o.a.createElement("i", {
								className: "fas fa-toggle-on"
							}, "ON") : o.a.createElement("i", {
								className: "fas fa-toggle-off"
							}, "OFF")
						}, n
					}
					return Object(d.a)(t, e), Object(l.a)(t, [{
						key: "render",
						value: function() {
							var e = this;
							return o.a.createElement(v.b, {
								color: "mdb-color",
								outline: !this.props.pinState,
								onClick: function() {
									null != e.props.onClick && e.props.onClick()
								}
							}, this.renderNameButton(this.props.pinState))
						}
					}]), t
				}(o.a.Component),
				I = o.a.createContext({
					scenarioTests: []
				}),
				D = o.a.createContext({}),
				R = o.a.createContext({}),
				N = {
					hasBeenAllocated: [],
					_uuidv4: function() {
						return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
							var t = 16 * Math.random() | 0;
							return ("x" === e ? t : 3 & t | 8).toString(16)
						})
					},
					create: function() {
						for (;;) {
							var e = this._uuidv4();
							if (this.hasBeenAllocated.indexOf(e) < 0) {
								this.hasBeenAllocated.push(e);
								break
							}
						}
						return e
					}
				},
				F = function() {
					return N.create.call(N)
				},
				A = n(37),
				O = n.n(A),
				j = function(e) {
					function t(e) {
						var n;
						return Object(c.a)(this, t), (n = Object(u.a)(this, Object(m.a)(t).call(this, e))).componentWillUpdate = function() {}, n.componentWillMount = function() {
							n.store = {
								showModal: !1,
								pinSettings: [{
									pinName: "userButton",
									pinNum: 21,
									key: F(),
									actions: [],
									pinState: !1,
									onMouseIn: !1,
									minusButtonOnMouseDown: !1,
									toolTip: null
								}, {
									pinName: "antiCheatButton",
									key: F(),
									pinNum: 12,
									actions: [],
									pinState: !1,
									onMouseIn: !1,
									minusButtonOnMouseDown: !1,
									toolTip: null
								}, {
									pinName: "resetPin",
									key: F(),
									pinNum: 20,
									actions: [],
									pinState: !1,
									onMouseIn: !1,
									minusButtonOnMouseDown: !1,
									toolTip: null
								}, {
									pinName: "hallSensorPin",
									key: F(),
									pinNum: 16,
									actions: [],
									pinState: !1,
									onMouseIn: !1,
									minusButtonOnMouseDown: !1,
									toolTip: null
								}],
								commandSetting: {
									commands: [],
									commandInput: "",
									key: F()
								},
								expect: {
									timeoutError: 0,
									logDebugs: [],
									logDebugInput: "",
									invalidInputTimeoutError: ""
								},
								delayAction: {
									key: F(),
									delayTime: null,
									inputError: !1
								},
								chooseFirmwareForBurning: {
									key: F(),
									firmwareVersions: [],
									firmwareChoosed: []
								}
							}, n.store = Object(k.a)({}, n.store, n.context.scenarioTests[n.props.scenarioTestId].actions[n.props.actionId]), n.context.actionSynchronousState(n.props.scenarioTestId, n.props.actionId, n.store)
						}, n.renderChooseFirmwareForburningButton = function() {
							return o.a.createElement(v.t, {
								style: {
									margin: "20px"
								},
								key: n.store.chooseFirmwareForBurning.key
							}, o.a.createElement(v.g, null, o.a.createElement(v.i, null, o.a.createElement(v.l, {
								outline: !0,
								color: "mdb-color"
							}, "Choose Firmware"), o.a.createElement(v.k, null, n.store.chooseFirmwareForBurning.firmwareVersions.map(function(e) {
								return o.a.createElement(v.j, {
									key: F(),
									onClick: function() {
										n.store.chooseFirmwareForBurning.firmwareChoosed = e, n.context.actionSynchronousState(n.props.scenarioTestId, n.props.actionId, n.store)
									}
								}, e)
							})))), o.a.createElement(v.g, null, "Firmware Choosed: ", n.store.chooseFirmwareForBurning.firmwareChoosed))
						}, n.toggleModal = function() {
							n.store.showModal = !n.store.showModal, n.store.commandSetting.commandInput = "", n.store.expect.logDebugInput = "", n.context.actionSynchronousState(n.props.scenarioTestId, n.props.actionId, n.store)
						}, n.closeModalHandle = function() {
							n.store.showModal = !n.store.showModal, n.context.actionSynchronousState(n.props.scenarioTestId, n.props.actionId, n.store)
						}, n.mousePositionGpioSettingButtonHandle = function(e, t) {
							var a = n.store.pinSettings.indexOf(t);
							n.store.pinSettings[a].onMouseIn = e, n.context.actionSynchronousState(n.props.scenarioTestId, n.props.actionId, n.store)
						}, n.renderInputCommandGroup = function(e) {
							return o.a.createElement(o.a.Fragment, {
								key: e.key
							}, o.a.createElement(v.t, {
								style: {
									margin: "20px"
								}
							}, o.a.createElement(v.g, null, o.a.createElement(v.m, {
								label: "Command",
								onChange: function(e) {
									n.context.scenarioTests[n.props.scenarioTestId].actions[n.props.actionId].commandSetting.commandInput = e.target.value, n.context.actionSynchronousState(n.props.scenarioTestId, n.props.actionId, n.store)
								}
							})), o.a.createElement(v.g, null, o.a.createElement(v.b, {
								outline: !0,
								color: "mdb-color",
								onClick: function() {
									"" !== n.context.scenarioTests[n.props.scenarioTestId].actions[n.props.actionId].commandSetting.commandInput ? (n.setState(function(e) {
										return {
											commandInputEmpty: !1
										}
									}), n.store.commandSetting.commands.push({
										command: n.store.commandSetting.commandInput,
										timeLength: 500,
										key: F()
									}), n.context.actionSynchronousState(n.props.scenarioTestId, n.props.actionId, n.store)) : n.setState(function(e) {
										return {
											commandInputEmpty: !0
										}
									})
								}
							}, o.a.createElement("i", {
								className: "fas fa-plus"
							}, "Add")), function() {
								if (n.state.commandInputEmpty) return o.a.createElement("dir", {
									style: {
										color: "red"
									}
								}, " command input is empty ")
							}())), o.a.createElement(v.t, {
								style: {
									margin: "20px"
								}
							}, n.context.scenarioTests[n.props.scenarioTestId].actions[n.props.actionId].commandSetting.commands.map(function(e) {
								return o.a.createElement(v.b, {
									onClick: function() {
										var t = n.context.scenarioTests[n.props.scenarioTestId].actions[n.props.actionId].commandSetting.commands.indexOf(e);
										n.context.scenarioTests[n.props.scenarioTestId].actions[n.props.actionId].commandSetting.commands.splice(t, 1), n.context.actionSynchronousState(n.props.scenarioTestId, n.props.actionId, n.store)
									},
									key: e.key,
									color: "mdb-color"
								}, e.command)
							})))
						}, n.renderDelayActions = function() {
							return o.a.createElement(v.t, {
								style: {
									margin: "20px"
								}
							}, o.a.createElement(v.g, null, o.a.createElement(v.m, {
								key: n.store.delayAction.key,
								label: n.context.scenarioTests[n.props.scenarioTestId].actions[n.props.actionId].delayAction.delayTime ? "Delay: " + n.context.scenarioTests[n.props.scenarioTestId].actions[n.props.actionId].delayAction.delayTime + " ms" : "Delay Time",
								onChange: function(e) {
									isNaN(e.target.value) ? n.store.delayAction.inputError = !0 : (n.store.delayAction.delayTime = e.target.value, n.store.delayAction.inputError = !1), n.context.actionSynchronousState(n.props.scenarioTestId, n.props.actionId, n.store)
								}
							}), function() {
								if (n.context.scenarioTests[n.props.scenarioTestId].actions[n.props.actionId].delayAction.inputError) return o.a.createElement("p", {
									style: {
										color: "red"
									}
								}, "You Must Input Number")
							}()))
						}, n.renderSettedGpioActions = function(e) {
							if (void 0 !== e) return e.map(function(e) {
								return e.on ? o.a.createElement(w, {
									key: e.key,
									style: {
										backgroundColor: "#92a8d1",
										width: e.timeLength
									},
									toolTipMs: e.timeLength
								}) : o.a.createElement(w, {
									key: e.key,
									style: {
										backgroundColor: "#7CFC00",
										width: e.timeLength
									},
									toolTipMs: e.timeLength
								})
							})
						}, n.renderGpioButtonSettingGroup = function(e) {
							return e.onMouseIn ? o.a.createElement(v.t, {
								style: {
									margin: "20px"
								}
							}, o.a.createElement(v.c, null, o.a.createElement(B, {
								pinState: e.pinState,
								onClick: function() {
									var t = n.store.pinSettings.indexOf(e);
									n.store.pinSettings[t].pinState = !n.store.pinSettings[t].pinState, n.context.actionSynchronousState(n.props.scenarioTestId, n.props.actionId, n.store)
								}
							}), o.a.createElement(v.b, {
								onClick: function() {
									var t = n.store.pinSettings.indexOf(e),
										a = n.store.pinSettings[t].actions.length - 1; - 1 === a && (a = 0, n.store.pinSettings[t].actions.push({
										on: e.pinState,
										timeLength: 0,
										key: F()
									})), n.store.pinSettings[t].actions[a].timeLength -= 50, n.store.pinSettings[t].actions[a].timeLength < 0 && n.store.pinSettings[t].actions.splice(-1, 1), n.context.actionSynchronousState(n.props.scenarioTestId, n.props.actionId, n.store)
								},
								outline: !0,
								color: "mdb-color"
							}, o.a.createElement("i", {
								className: "fas fa-minus"
							})), o.a.createElement(v.b, {
								onClick: function() {
									var t = n.store.pinSettings.indexOf(e),
										a = n.store.pinSettings[t].actions.length - 1; - 1 === a && (a = 0, n.store.pinSettings[t].actions.push({
										on: e.pinState,
										timeLength: 0,
										key: F()
									})), n.store.pinSettings[t].actions[a].on === e.pinState ? n.store.pinSettings[t].actions[a].timeLength += 50 : n.store.pinSettings[t].actions.push({
										on: e.pinState,
										timeLength: 50,
										key: F()
									}), n.context.actionSynchronousState(n.props.scenarioTestId, n.props.actionId, n.store)
								},
								outline: !0,
								color: "mdb-color"
							}, o.a.createElement("i", {
								className: "fas fa-plus"
							})), " ")) : o.a.createElement(v.b, {
								outline: !0,
								color: "mdb-color"
							}, o.a.createElement("i", {
								className: "fas fa-bolt"
							}, e.pinName))
						}, n.renderGpioActions = function(e) {
							return e.map(function(e) {
								return o.a.createElement(o.a.Fragment, {
									key: e.key
								}, o.a.createElement(v.t, {
									style: {
										margin: "20px"
									},
									onMouseEnter: n.mousePositionGpioSettingButtonHandle.bind(Object(C.a)(n), !0, e),
									onMouseLeave: n.mousePositionGpioSettingButtonHandle.bind(Object(C.a)(n), !1, e)
								}, n.renderGpioButtonSettingGroup(e)), o.a.createElement(v.t, {
									style: {
										margin: "20px"
									}
								}, n.renderSettedGpioActions(e.actions)))
							})
						}, n.state = {
							commandInputEmpty: !1,
							logInputEmpty: !1,
							commandInput: "",
							mouseEnterActionButton: !1
						}, n
					}
					return Object(d.a)(t, e), Object(l.a)(t, [{
						key: "componentDidMount",
						value: function() {
							var e = this;
							console.log("action componentDidMount"), O.a.get("/api/getStoredFirmwareVersions").then(function(t) {
								e.store.chooseFirmwareForBurning.firmwareVersions = t.data.firmwareVersions, e.context.actionSynchronousState(e.props.scenarioTestId, e.props.actionId, e.store)
							})
						}
					}, {
						key: "render",
						value: function() {
							var e = this;
							return o.a.createElement("div", null, o.a.createElement(v.h, null, o.a.createElement("div", {
								onMouseEnter: function() {
									e.setState(function(e) {
										return {
											mouseEnterActionButton: !0
										}
									})
								},
								onMouseLeave: function() {
									e.setState(function(e) {
										return {
											mouseEnterActionButton: !1
										}
									})
								}
							}, o.a.createElement(v.b, {
								outline: !0,
								color: "in testing..." === e.props.type || e.state.mouseEnterActionButton ? "warning" : "mdb-color",
								onClick: this.toggleModal
							}, o.a.createElement("i", {
								className: "fas fa-cogs"
							}), " ", e.state.mouseEnterActionButton ? o.a.createElement(o.a.Fragment, null, "Config Action") : e.props.type)), o.a.createElement(v.p, {
								size: "lg",
								isOpen: this.context.scenarioTests[this.props.scenarioTestId].actions[this.props.actionId].showModal,
								toggle: this.toggleModal
							}, o.a.createElement(v.q, null, o.a.createElement(v.h, {
								style: {
									margin: "60px"
								}
							}, "gpio" === e.props.type ? e.renderGpioActions(e.context.scenarioTests[e.props.scenarioTestId].actions[e.props.actionId].pinSettings) : "eraseFirmware" !== e.props.type ? "burnFirmware" === e.props.type ? e.renderChooseFirmwareForburningButton() : "command" === e.props.type ? e.renderInputCommandGroup(e.context.scenarioTests[e.props.scenarioTestId].actions[e.props.actionId].commandSetting) : "delay" === e.props.type ? e.renderDelayActions() : void 0 : void 0, o.a.createElement(v.t, {
								style: {
									margin: "20px"
								}
							}, o.a.createElement(v.g, null, o.a.createElement(v.m, {
								label: "What do you expect from log debug ?",
								onChange: function(t) {
									e.store.expect.logDebugInput = t.target.value, e.context.actionSynchronousState(e.props.scenarioTestId, e.props.actionId, e.store)
								}
							})), o.a.createElement(v.g, null, o.a.createElement(v.b, {
								outline: !0,
								color: "mdb-color",
								onClick: function() {
									"" !== e.store.expect.logDebugInput ? (e.setState(function(e) {
										return {
											logInputEmpty: !1
										}
									}), e.store.expect.logDebugs.push({
										logDebug: e.store.expect.logDebugInput,
										key: F()
									}), e.context.actionSynchronousState(e.props.scenarioTestId, e.props.actionId, e.store)) : e.setState(function(e) {
										return {
											logInputEmpty: !0
										}
									})
								}
							}, " Add "), function() {
								if (e.state.logInputEmpty) return o.a.createElement("div", {
									style: {
										color: "red"
									}
								}, " you should input expect log output ")
							}())), o.a.createElement(v.t, {
								style: {
									margin: "20px"
								}
							}, e.store.expect.logDebugs.map(function(t) {
								return o.a.createElement(v.b, {
									onClick: function() {
										var n = e.store.expect.logDebugs.indexOf(t);
										e.store.expect.logDebugs.splice(n, 1), e.context.actionSynchronousState(e.props.scenarioTestId, e.props.actionId, e.store)
									},
									color: "mdb-color",
									key: t.key
								}, t.logDebug)
							})), o.a.createElement(v.t, {
								style: {
									margin: "20px"
								}
							}, o.a.createElement(v.g, null, o.a.createElement(v.m, {
								label: "TimeOut Error: " + this.store.expect.timeoutError + " ms",
								onChange: function(t) {
									e.store.expect.timeoutError = t.target.value, isNaN(e.store.expect.timeoutError) ? e.store.expect.invalidInputTimeoutError = "you must input number" : e.store.expect.invalidInputTimeoutError = "", e.context.actionSynchronousState(e.props.scenarioTestId, e.props.actionId, e.store)
								}
							}), e.store.expect.invalidInputTimeoutError ? o.a.createElement("p", {
								style: {
									color: "red"
								}
							}, e.store.expect.invalidInputTimeoutError) : void 0)))), o.a.createElement(v.r, null, o.a.createElement(v.b, {
								outline: !0,
								color: "warning",
								onClick: function() {
									e.context.deleteAction(e.props.scenarioTestId, e.props.actionId)
								}
							}, o.a.createElement("i", {
								className: "fas fa-cogs"
							}), " Delete Action"), o.a.createElement(v.b, {
								outline: !0,
								color: "mdb-color",
								onClick: this.toggleModal
							}, "Close")))))
						}
					}]), t
				}(o.a.Component);
			j.contextType = I;
			var M = j,
				L = function(e) {
					function t(e) {
						var n;
						return Object(c.a)(this, t), (n = Object(u.a)(this, Object(m.a)(t).call(this, e))).componentWillMount = function() {
							n.store = {
								typeAction: {
									gpio: "gpio",
									eraseFirmware: "eraseFirmware",
									burnFirmware: "burnFirmware",
									command: "command",
									delay: "delay"
								},
								actions: [],
								name: "",
								numLoop: "",
								createActionButton: {
									mouseEnter: !1,
									key: F()
								},
								scenarioTestId: n.props.scenarioTestId
							}, n.store = Object(k.a)({}, n.store, n.context.scenarioTests[n.props.scenarioTestId])
						}, n.componentWillUpdate = function() {}, n.createAction = function(e) {
							n.store.actions.push({
								type: e,
								name: null,
								key: F()
							}), n.context.scenarioTestSynchronousState(n.props.scenarioTestId, n.store)
						}, n.mouseEnterCreateActionButtonHandle = function(e) {
							n.store.createActionButton.mouseEnter = e, n.context.scenarioTestSynchronousState(n.props.scenarioTestId, n.store)
						}, n.renderActions = function() {
							return n.store.actions.map(function(e, t) {
								return o.a.createElement(M, {
									key: e.key,
									type: e.type,
									name: e.name,
									scenarioTestId: n.props.scenarioTestId,
									actionId: t
								})
							})
						}, n.renderCreateActionButton = function() {
							return o.a.createElement("div", {
								onClick: function() {
									n.setState(function(e) {
										return {
											chooseActionTypes: !e.chooseActionTypes
										}
									})
								}
							}, o.a.createElement(v.i, null, o.a.createElement(v.l, {
								color: "mdb-color",
								outline: !0
							}, o.a.createElement("i", {
								className: "fas fa-plus"
							}, " Create Action ")), o.a.createElement(v.k, null, Object.keys(n.store.typeAction).map(function(e, t) {
								return o.a.createElement(v.j, {
									color: "mdb-color",
									onClick: n.createAction.bind(Object(C.a)(n), n.store.typeAction[e]),
									type: n.store.typeAction[e],
									key: F()
								}, e)
							}))))
						}, n.store = {}, n.state = {
							inputNumLoopError: !1,
							chooseActionTypes: !0
						}, n
					}
					return Object(d.a)(t, e), Object(l.a)(t, [{
						key: "render",
						value: function() {
							var e = this;
							return o.a.createElement(o.a.Fragment, null, o.a.createElement(v.t, null, o.a.createElement(v.g, null, o.a.createElement(v.m, {
								label: "" === e.store.name ? "Input Name Senario Test" : "Setted Name: " + e.store.name,
								onChange: function(t) {
									e.context.scenarioTestStoreName(e.props.scenarioTestId, t.target.value)
								}
							})), o.a.createElement(v.g, null, o.a.createElement(v.m, {
								label: "" === e.store.numLoop ? "Num Loop" : "Setted Num: " + e.store.numLoop,
								onChange: function(t) {
									isNaN(t.target.value) ? e.setState(function(e) {
										return {
											inputNumLoopError: !0
										}
									}) : (e.setState(function(e) {
										return {
											inputNumLoopError: !1
										}
									}), e.context.scenarioTestStoreNumloop(e.props.scenarioTestId, t.target.value))
								}
							}), function() {
								if (e.state.inputNumLoopError) return o.a.createElement("div", {
									style: {
										color: "red"
									}
								}, "Num Loop Should Be A number")
							}()), o.a.createElement(v.g, null, o.a.createElement("div", {
								className: "text-right"
							}, o.a.createElement(v.b, {
								outline: !0,
								color: "warning",
								onClick: this.context.deleteScenarioTest.bind(null, this.props.scenarioTestId)
							}, o.a.createElement("i", {
								className: "fas fa-trash-alt"
							}, " Delete This Test "))))), o.a.createElement(v.t, null, this.renderActions(), this.renderCreateActionButton()))
						}
					}]), t
				}(o.a.Component);
			L.contextType = I;
			var P = L,
				G = function(e) {
					function t(e) {
						var n;
						return Object(c.a)(this, t), (n = Object(u.a)(this, Object(m.a)(t).call(this, e))).appendNewScenarioTest = function(e, t) {
							var a = Object(x.a)(n.context.scenarioTestsGlobal);
							a.push({
								key: F(),
								actions: []
							}), n.context.setStoreScenarioTestsToGlobal(a)
						}, n.deleteScenarioTest = function(e) {
							var t = Object(x.a)(n.context.scenarioTestsGlobal);
							t.splice(e, 1), n.context.setStoreScenarioTestsToGlobal(t)
						}, n.scenarioTestStoreName = function(e, t) {
							var a = Object(x.a)(n.context.scenarioTestsGlobal);
							a[e].name = t, n.context.setStoreScenarioTestsToGlobal(a)
						}, n.scenarioTestStoreNumloop = function(e, t) {
							var a = Object(x.a)(n.context.scenarioTestsGlobal);
							a[e].numLoop = t, n.context.setStoreScenarioTestsToGlobal(a)
						}, n.deleteAction = function(e, t) {
							var a = Object(x.a)(n.context.scenarioTestsGlobal);
							a[e].actions.splice(t, 1), console.log("scenarioTestsGlobal[scenarioTestId].actions: ", a[e].actions), n.context.setStoreScenarioTestsToGlobal(a)
						}, n.scenarioTestSynchronousState = function(e, t) {
							var a = Object(x.a)(n.context.scenarioTestsGlobal);
							a[e] = t, n.context.setStoreScenarioTestsToGlobal(a)
						}, n.actionSynchronousState = function(e, t, a) {
							var o = Object(x.a)(n.context.scenarioTestsGlobal);
							o[e].actions[t] = a, n.context.setStoreScenarioTestsToGlobal(o)
						}, n.renderSaveButton = function() {
							return n.state.saveButton.openForm ? o.a.createElement(v.t, null, o.a.createElement(v.g, null, o.a.createElement("input", {
								onChange: function(e) {
									var t = e.target.value;
									n.setState(function(e) {
										return e.saveButton.inputNameBoot = t, {
											saveButton: e.saveButton
										}
									})
								},
								label: "Name Boot"
							}), o.a.createElement("input", {
								onChange: function(e) {
									var t = e.target.value;
									n.setState(function(e) {
										return e.saveButton.inputDescription = t, {
											saveButton: e.saveButton
										}
									})
								},
								label: "Description"
							})), o.a.createElement(v.g, null, o.a.createElement(v.b, {
								onClick: function() {
									console.log("scenarioTestsGlobal saved", n.context.scenarioTestsGlobal), O.a.post("/boot_save", {
										data: n.context.scenarioTestsGlobal,
										bootName: n.state.saveButton.inputNameBoot,
										description: n.state.saveButton.inputDescription
									}).then(function(e) {
										console.log(e)
									}).catch(function(e) {
										console.log("post data error: ", e)
									})
								},
								color: "mdb-color"
							}, "Ok"), o.a.createElement(v.b, {
								onClick: function() {
									n.setState(function(e) {
										return e.saveButton.openForm = !1, {
											saveButton: e.saveButton
										}
									})
								},
								color: "mdb-color",
								outline: !0
							}, "Close"))) : o.a.createElement(v.b, {
								color: "mdb-color",
								onClick: function() {
									n.setState(function(e) {
										return e.saveButton.openForm = !0, {
											saveButton: e.saveButton
										}
									})
								}
							}, "Save Boot")
						}, n.renderScenarioTests = function(e) {
							if (null !== e) return e.map(function(e, t) {
								return o.a.createElement(P, {
									name: e.name,
									numLoop: e.numLoop,
									key: e.key,
									scenarioTestId: t
								})
							})
						}, n.state = {
							saveButton: {
								openForm: !1,
								inputNameBoot: "",
								inputDescription: ""
							}
						}, n
					}
					return Object(d.a)(t, e), Object(l.a)(t, [{
						key: "render",
						value: function() {
							return o.a.createElement("div", null, o.a.createElement(I.Provider, {
								value: {
									scenarioTestSynchronousState: this.scenarioTestSynchronousState,
									actionSynchronousState: this.actionSynchronousState,
									deleteScenarioTest: this.deleteScenarioTest,
									scenarioTests: this.context.scenarioTestsGlobal,
									scenarioTestStoreName: this.scenarioTestStoreName,
									scenarioTestStoreNumloop: this.scenarioTestStoreNumloop,
									deleteAction: this.deleteAction,
									bootSocket: this.context.socketIoContext
								}
							}, this.renderScenarioTests(this.context.scenarioTestsGlobal), o.a.createElement(v.c, {
								style: {
									width: "100%"
								}
							}, o.a.createElement(v.b, {
								onClick: this.appendNewScenarioTest,
								color: "mdb-color",
								outline: !0
							}, "Create New Senario Test"), this.renderSaveButton())))
						}
					}]), t
				}(o.a.Component);
			G.contextType = D;
			var Q = G,
				H = n(86),
				V = n.n(H),
				W = n(125),
				K = function(e) {
					function t(e) {
						var n;
						return Object(c.a)(this, t), (n = Object(u.a)(this, Object(m.a)(t).call(this, e))).getBootInfo = function() {
							O.a.get("/api/get_boot_infos").then(function(e) {
								var t = e.data.data,
									a = [];
								t.map(function(e) {
									a.push({
										bootName: e.bootName,
										description: e.description,
										data: e.data,
										id: e._id,
										key: F(),
										onMouseEnter: !1
									})
								}), n.setState(function(e) {
									return {
										bootInfos: a
									}
								}), console.log("get boot infos ", t)
							})
						}, n.mouseEnterChoosingItemHandle = function(e, t) {
							var a = n.state.bootInfos.indexOf(e);
							n.setState(function(e) {
								return e.bootInfos[a].onMouseEnter = t, {
									bootInfos: e.bootInfos
								}
							})
						}, n.renderItems = function() {
							return console.log("this.props: ", n.props), n.state.bootInfos.map(function(e) {
								return o.a.createElement("div", {
									key: e.key,
									style: {
										width: "100%"
									},
									onMouseEnter: n.mouseEnterChoosingItemHandle.bind(null, e, !0),
									onMouseLeave: n.mouseEnterChoosingItemHandle.bind(null, e, !1)
								}, e.onMouseEnter ? o.a.createElement(v.c, null, o.a.createElement(v.b, {
									color: "mdb-color",
									onClick: function() {
										var t = JSON.parse(e.data),
											a = e.bootName;
										n.context.choosedBootHandle(a, t)
									},
									outline: !0
								}, "Choose Boot"), o.a.createElement(v.b, {
									outline: !0,
									color: "warning",
									onClick: function() {
										O.a.get("/api/deleteBoot?id=".concat(e.id)).then(function(e) {})
									}
								}, "Delete Boot")) : o.a.createElement(v.j, null, " ", o.a.createElement("b", null, "Name: "), " ", e.bootName, " ", o.a.createElement("b", null, "Description: "), e.description))
							})
						}, n.state = {
							bootInfos: []
						}, n
					}
					return Object(d.a)(t, e), Object(l.a)(t, [{
						key: "componentWillMount",
						value: function() {
							this.getBootInfo()
						}
					}, {
						key: "componentDidUpdate",
						value: function() {}
					}, {
						key: "render",
						value: function() {
							var e = this;
							return o.a.createElement(v.i, null, o.a.createElement(v.l, {
								color: "mdb-color",
								onClick: function() {
									e.getBootInfo()
								},
								disabled: this.props.disabled
							}, "Choose Boot"), o.a.createElement(v.k, {
								basic: !0
							}, this.renderItems(), o.a.createElement(v.b, {
								style: {
									width: "100%"
								},
								color: "mdb-color",
								outline: !0,
								onClick: function() {
									e.context.setStoreScenarioTestsToGlobal([]), e.context.setCreateBootView(!0)
								}
							}, "Create New Boot")))
						}
					}]), t
				}(o.a.Component);
			K.contextType = D;
			var q = K,
				U = n(249),
				_ = n(262),
				J = n(259),
				z = (n(200), function(e) {
					function t(e) {
						var n;
						return Object(c.a)(this, t), (n = Object(u.a)(this, Object(m.a)(t).call(this, e))).renderSerialCommandInput = function() {
							return o.a.createElement(J.a, {
								style: {
									marginBottom: "22px"
								},
								id: "standard-basic",
								onChange: function(e) {
									var t = e.target.value;
									n.setState(function(e) {
										return {
											serialCommandInput: t
										}
									})
								},
								onKeyDown: function(e) {
									console.log("send command"), "Enter" === e.key && n.context.bootSocket.emit("sendSerial", n.state.serialCommandInput)
								},
								fullWidth: !0,
								label: "Box Command"
							})
						}, n.autoScrollingCheckBox = o.a.createElement(U.a, {
							control: o.a.createElement(_.a, {
								onChange: function(e) {
									var t = e.target.checked;
									n.setState(function(e) {
										return {
											isAutoScroll: !t
										}
									})
								}
							}),
							label: "Stop Auto Scroll"
						}), n.state = {
							serialData: [],
							serialCommandInput: "",
							senddingSerialCommandFail: null,
							isAutoScroll: !0
						}, n.textLog = o.a.createRef(), n
					}
					return Object(d.a)(t, e), Object(l.a)(t, [{
						key: "shouldComponentUpdate",
						value: function(e, t) {
							return t.serialData !== this.state.serialData
						}
					}, {
						key: "renderSerialData",
						value: function() {
							return this.state.serialData.map(function(e) {
								return o.a.createElement("p", null, e)
							})
						}
					}, {
						key: "componentDidMount",
						value: function() {
							var e = this;
							this.context.bootSocket.on("serialData", function(t) {
								var n = Object(x.a)(e.state.serialData);
								n.push(t), n.length > 2e3 && (n = []), e.setState(function(e) {
									return {
										serialData: n
									}
								})
							})
						}
					}, {
						key: "componentWillUnmount",
						value: function() {
							this.context.bootSocket.removeListener("serialData"), console.log("serial display unmount")
						}
					}, {
						key: "componentDidUpdate",
						value: function() {
							this.state.isAutoScroll && (this.textLog.current.scrollTop = this.textLog.current.scrollHeight)
						}
					}, {
						key: "render",
						value: function() {
							return o.a.createElement("div", null, o.a.createElement("div", {
								style: {
									display: "flex"
								}
							}, this.autoScrollingCheckBox, this.renderSerialCommandInput()), o.a.createElement("div", {
								ref: this.textLog,
								class: "serialDisplay"
							}, this.renderSerialData()))
						}
					}]), t
				}(a.Component));
			z.contextType = R;
			var Y = z,
				X = function(e) {
					function t(e) {
						var n;
						return Object(c.a)(this, t), (n = Object(u.a)(this, Object(m.a)(t).call(this, e))).runAction = function(e) {
							n.context.socketIoContext.emit("runAction", e)
						}, n.runAutomationTest = Object(W.a)(V.a.mark(function e() {
							return V.a.wrap(function(e) {
								for (;;) switch (e.prev = e.next) {
									case 0:
										n.context.setHardwareInBusy(!0), n.context.socketIoContext.emit("runBoot", {
											scenarioTests: n.context.scenarioTestsGlobal,
											testingName: F()
										});
									case 2:
									case "end":
										return e.stop()
								}
							}, e)
						})), n.renderInforQc = function() {
							return o.a.createElement("div", {
								style: {
									display: "fex",
									flexDirection: "column"
								}
							}, o.a.createElement("h4", null, "Box Info"), o.a.createElement("ul", {
								key: F()
							}, Object.keys(n.state.boxInfos).map(function(e) {
								return o.a.createElement("li", {
									key: F()
								}, o.a.createElement("h5", null, e, ": ", n.state.boxInfos.key))
							})))
						}, n.renderBootChoosingBt = function() {
							return o.a.createElement(q, {
								disabled: n.context.hardwareInBusy
							})
						}, n.renderRunautomaticTestBt = function() {
							return o.a.createElement(v.b, {
								disabled: n.context.hardwareInBusy,
								onClick: n.runAutomationTest,
								color: "mdb-color"
							}, "Run Automation Test")
						}, n.renderSerialCommandInput = function() {
							return o.a.createElement("div", {
								className: "input-group"
							}, o.a.createElement("input", {
								onChange: function(e) {
									var t = e.target.value;
									n.setState(function(e) {
										return {
											serialCommandInput: t
										}
									})
								},
								onKeyDown: function(e) {
									"Enter" === e.key && n.context.socketIoContext.emit("sendSerial", n.state.serialCommandInput)
								},
								style: n.state.senddingSerialCommandFail ? {
									color: "red"
								} : {
									color: ""
								},
								type: "text",
								placeholder: "Box Command",
								className: "form-control form-control-lg"
							}))
						}, n.renderBurnFirmwareButton = function() {
							return o.a.createElement(v.i, null, o.a.createElement(v.l, {
								color: "mdb-color",
								outline: !0,
								disabled: n.context.hardwareInBusy
							}, n.state.statusBurningFirmware), o.a.createElement(v.k, null, n.state.storedFirmwareVersions.map(function(e) {
								return o.a.createElement(v.j, {
									key: F(),
									onClick: function() {
										n.context.socketIoContext.emit("clientRequestBurnFirmware", e)
									},
									color: "mdb-color"
								}, e)
							})))
						}, n.renderEraseFirmwareButton = function() {
							return o.a.createElement(o.a.Fragment, null, o.a.createElement(v.b, {
								color: "mdb-color",
								outline: !0,
								disabled: n.context.hardwareInBusy,
								onClick: function() {
									n.context.setHardwareInBusy(!0), n.context.socketIoContext.emit("eraseFirmware", "")
								}
							}, "Erase All"), o.a.createElement(v.b, {
								color: "mdb-color",
								outline: !0,
								disabled: n.context.hardwareInBusy,
								onClick: function() {
									n.context.setHardwareInBusy(!0), n.context.socketIoContext.emit("eraseFirmware", "firmwarePartition")
								}
							}, "Erase Firmware Partition"))
						}, n.sendkeyBt = function() {
							return o.a.createElement(v.b, {
								color: "mdb-color",
								outline: !0,
								disabled: n.context.hardwareInBusy,
								onClick: function() {
									n.context.setHardwareInBusy(!0), n.context.socketIoContext.emit("sendKeys", "")
								}
							}, "Send Keys")
						}, n.renderStatusSerialPort = function() {
							return o.a.createElement(v.a, {
								color: "successful" === n.context.connectToDeviceStatus.type ? "mdb-color" : "warning",
								outline: !0
							}, "Serial Port Connecting: ", n.context.connectToDeviceStatus.port)
						}, n.renderPrintLabelBt = o.a.createElement(v.b, {
							color: "mdb-color",
							outline: !0
						}, "Print Label"), n.state = {
							boxInfos: {
								firmwareVersion: "",
								efuse: "",
								macAddress: "",
								imgsInFlash: "",
								brokenImageCount: "",
								batteryLevel: "",
								isWifiConnected: !1,
								rssi: ""
							},
							statusDevice: {
								port: null,
								type: null
							},
							storedFirmwareVersions: [],
							statusBurningFirmware: "BurnFirmware",
							serialCommandInput: null,
							senddingSerialCommandFail: !1
						}, n.firmwareVersionStored = [], n
					}
					return Object(d.a)(t, e), Object(l.a)(t, [{
						key: "componentWillUnmount",
						value: function() {
							this.context.socketIoContext.off()
						}
					}, {
						key: "componentDidMount",
						value: function() {
							var e = this;
							setTimeout(function() {
								e.context.socketIoContext.on("deviceBusy", function(t) {
									e.context.setHardwareInBusy(!0)
								}), e.context.socketIoContext.on("bootBeginRunAction", function(t) {
									var n = Object(x.a)(e.context.scenarioTestsGlobal);
									console.log("scenarioTestsGlobal: ", n), n.map(function(e) {
										e.actions.map(function(n, a) {
											n.key === t && (e.actions[a].type = "in testing...")
										})
									}), e.context.setStoreScenarioTestsToGlobal(n)
								}), e.context.socketIoContext.on("bootDoneRunAction", function(t) {
									var n = Object(x.a)(e.context.scenarioTestsGlobal);
									n.map(function(e) {
										e.actions.map(function(e) {
											e.key === t.key && (e.type = t.type)
										})
									}), e.context.setStoreScenarioTestsToGlobal(n)
								}), e.context.socketIoContext.on("connectToDeviceStatus", function(t) {
									e.context.setConnectToDeviceStatus(t)
								}), e.context.socketIoContext.on("storedFirmwareVersionsForQctool", function(t) {
									console.log("firmware: ", t), e.setState(function(e) {
										return {
											storedFirmwareVersions: t
										}
									})
								}), e.context.socketIoContext.on("sendKeysStatus", function(t) {
									e.context.setHardwareInBusy(!1), "SendKeysSuccessFull" == t ? e.context.addNotification("sendKeysStatus", t, "success", 5e3) : e.context.addNotification("sendKeysStatus", t, "danger", 5e3)
								}), e.context.socketIoContext.on("statusBurnFirmware", function(t) {
									e.context.setHardwareInBusy(!0), "beginBurnFirmware" === t ? (e.context.addNotification("statusBurnFirmware", t, "success", 3e3), e.setState(function(e) {
										return console.log("status: ", t), {
											statusBurningFirmware: "Burning Firmware..."
										}
									})) : "burnFirmwareSuccessFull" === t ? (e.context.addNotification("statusBurnFirmware", t, "success", 3e3), e.setState(function(e) {
										return {
											statusBurningFirmware: "Burn Firmware"
										}
									}), e.context.setHardwareInBusy(!1)) : "burnFirmwareFail" === t && (e.context.addNotification("statusBurnFirmware", t, "danger", 5e3), e.setState(function(e) {
										return {
											statusBurningFirmware: "Burn Firmware"
										}
									}), e.context.setHardwareInBusy(!1))
								}), e.context.socketIoContext.on("foundExpectedLogdebug", function(t) {
									e.context.addNotification("foundExpectedLogdebug", JSON.stringify(t), "success", 3e3)
								}), e.context.socketIoContext.on("showTestinResult", function(t) {
									e.context.pushNewTestingResult(t), console.log("pushed testing result: ", t)
								}), e.context.socketIoContext.on("eraseFirmwareStatus", function(t) {
									"beginEraseFirmware" === t ? (e.context.setHardwareInBusy(!0), e.context.addNotification("eraseFirmwareStatus", t, "success", 3e3)) : "eraseFirmwareDone" === t ? (e.context.setHardwareInBusy(!1), e.context.addNotification("eraseFirmwareStatus", t, "success", 3e3)) : (e.context.setHardwareInBusy(!1), e.context.addNotification("eraseFirmwareStatus", t, "danger", 3e3))
								}), e.context.socketIoContext.on("bootDoneRunTestAutomation", function(t) {
									console.log("bootDoneRunTestAutomation"), e.context.setHardwareInBusy(!1)
								}), e.context.socketIoContext.on("serialSendingStatus", function(t) {
									"success" === t ? e.setState(function(e) {
										return {
											senddingSerialCommandFail: !1
										}
									}) : e.setState(function(e) {
										return console.log("sending fail"), {
											senddingSerialCommandFail: !0
										}
									})
								}), e.context.socketIoContext.emit("qctoolRequestGetlistFirmware", ""), e.context.socketIoContext.emit("requestStatusDevice", "")
							}, 1e3), this.context.socketIoContext.emit("turnQctoolToDiagnosisMode", "")
						}
					}, {
						key: "render",
						value: function() {
							return o.a.createElement(v.d, {
								style: {
									width: "100%"
								}
							}, o.a.createElement(v.e, null, o.a.createElement(v.f, null, this.renderStatusSerialPort()), o.a.createElement(v.t, null, o.a.createElement(v.g, {
								size: 3
							}, this.renderInforQc(), o.a.createElement("div", {
								style: {
									display: "flex",
									flexWrap: "wrap"
								}
							}, this.renderBurnFirmwareButton(), this.renderEraseFirmwareButton(), this.renderPrintLabelBt, this.sendkeyBt(), this.renderBootChoosingBt(), this.renderRunautomaticTestBt())), o.a.createElement(v.g, {
								fluid: !0,
								size: 6
							}, o.a.createElement(Y, null)))))
						}
					}]), t
				}(o.a.Component);
			X.contextType = D;
			var Z = X,
				$ = n(49),
				ee = n.n($),
				te = (n(82), function(e) {
					function t(e) {
						var n;
						return Object(c.a)(this, t), (n = Object(u.a)(this, Object(m.a)(t).call(this, e))).renderLogDebugsSearchedResult = function(e) {
							return o.a.createElement("div", {
								key: F()
							}, "Pass:", o.a.createElement("ul", null, e.pass.map(function(e) {
								return o.a.createElement("li", null, JSON.stringify(e))
							})), "Fail:", o.a.createElement("ul", null, e.error.map(function(e) {
								return o.a.createElement("li", null, JSON.stringify(e))
							})))
						}, n.renderTestingResultTable = function(e) {
							return o.a.createElement(v.u, {
								key: F()
							}, o.a.createElement(v.w, null, o.a.createElement("tr", null, Object.keys(e.results[0]).map(function(e) {
								return o.a.createElement("th", {
									key: F()
								}, e)
							}))), o.a.createElement(v.v, null, e.results.map(function(e) {
								return o.a.createElement("tr", null, Object.keys(e).map(function(t) {
									return "logDebugsSearchedResult" === t ? (console.log("render renderLogDebugsSearchedResult: ", e[t]), n.renderLogDebugsSearchedResult(e[t])) : o.a.createElement("td", null, JSON.stringify(e[t]))
								}))
							})))
						}, n.renderAllResult = function() {
							return n.context.testingResults.map(function(e, t) {
								return o.a.createElement(o.a.Fragment, null, o.a.createElement(v.b, {
									outline: !0,
									color: "mdb-color",
									onClick: n.context.toogleShowDetailTestingResult.bind(null, t)
								}, "Show Detail Testing For: ", e.testingName), o.a.createElement("div", null, function() {
									if (e.showDetail) return n.renderTestingResultTable(e)
								}()))
							})
						}, n
					}
					return Object(d.a)(t, e), Object(l.a)(t, [{
						key: "render",
						value: function() {
							return console.log("this.context.testingResults: ", this.context.testingResults), o.a.createElement(o.a.Fragment, null, this.renderAllResult())
						}
					}]), t
				}(o.a.Component));
			te.contextType = D;
			var ne = te,
				ae = function(e) {
					function t(e) {
						return Object(c.a)(this, t), Object(u.a)(this, Object(m.a)(t).call(this, e))
					}
					return Object(d.a)(t, e), Object(l.a)(t, [{
						key: "render",
						value: function() {
							var e = this;
							return this.context.testingResults.map(function(t, n) {
								var a = !1;
								return t.results.map(function(e) {
									console.log("result.logDebugsSearchedResult.error: ", e.logDebugsSearchedResult.error), e.logDebugsSearchedResult.error.length > 0 && (a = !0, console.log("this test", t, "error"))
								}), o.a.createElement("div", {
									key: F()
								}, o.a.createElement(v.b, {
									outline: !0,
									color: a ? "danger" : "mdb-color",
									onClick: e.context.toogleShowTestManual.bind(null, n)
								}, a ? o.a.createElement("div", null, "TestName: ", t.testingName, o.a.createElement("strong", null, " Error "), "Vui L\xf2ng B\u1ecf B\xe0i Test \u0110\u1ec3 Test L\u1ea1i") : o.a.createElement("div", null, "TestName: ", t.testingName, o.a.createElement("strong", null, " Pass "), "Click V\xe0o \u0110\xe2y \u0110\u1ec3 Test Manual")), o.a.createElement(v.b, {
									outline: !0,
									color: "warning"
								}, "B\u1ecf B\xe0i Test V\xe0 Test L\u1ea1i"), function() {
									if (t.showTestManual) return o.a.createElement("div", null, o.a.createElement("p", null, o.a.createElement("strong", null, " B\u1ea1n H\xe3y M\u1edf M\u1ed9t N\u1eafp Bia Gi\u1ea3 V\xe0 Tr\u1ea3 L\u1eddi Nh\u1eefng C\xe2u H\u1ecfi D\u01b0\u1edbi \u0110\xe2y")), o.a.createElement("strong", null, "LED c\xf3 S\xe1ng \u0110\u1ee7 Ba M\xe0u Kh\xf4ng C\xf3 S\xe1ng Kh\xf4ng ?: "), o.a.createElement("input", {
										type: "checkbox",
										id: "myCheck"
									}))
								}())
							})
						}
					}]), t
				}(o.a.Component);
			ae.contextType = D;
			var oe = ae;

			function re(e) {
				return o.a.createElement(y.a, {
					component: "div",
					style: {
						padding: 24
					}
				}, e.children)
			}
			var se = function(e) {
				function t(e) {
					var n;
					return Object(c.a)(this, t), (n = Object(u.a)(this, Object(m.a)(t).call(this, e))).handleChange = function(e, t) {
						n.setState({
							value: t
						})
					}, n.addNotification = function(e, t, a, o) {
						n.notificationDOMRef.current.addNotification({
							title: e,
							message: t,
							type: a,
							insert: "top",
							container: "top-right",
							animationIn: ["animated", "fadeIn"],
							animationOut: ["animated", "fadeOut"],
							dismiss: {
								duration: parseInt(o)
							},
							dismissable: {
								click: !0
							}
						})
					}, n.setStoreScenarioTestsToGlobal = function(e) {
						n.setState(function(t) {
							return {
								scenarioTestsGlobal: e
							}
						})
					}, n.choosedBootHandle = function(e, t) {
						console.log("choosed scenarioTests", t), n.setState(function(n) {
							return {
								choosedBoot: e,
								scenarioTestsGlobal: t
							}
						})
					}, n.pushNewTestingResult = function(e) {
						n.setState(function(t) {
							var n = !0;
							return t.testingResults.map(function(a, o) {
								if (a.testingName === e.testingName) return n = !1, console.log("testingResultSend", e), t.testingResults[o] = e
							}), n && (e.showDetail = !1, e.showTestManual = !1, t.testingResults.push(e)), console.log("testingResults: ", t.testingResults), {
								testingResults: t.testingResults
							}
						})
					}, n.setConnectToDeviceStatus = function(e) {
						n.setState(function(t) {
							return {
								connectToDeviceStatus: e
							}
						})
					}, n.setCreateBootView = function(e) {
						n.setState(function(t) {
							return {
								openCreateBootView: e
							}
						})
					}, n.toogleShowDetailTestingResult = function(e) {
						n.setState(function(t) {
							return t.testingResults[e].showDetail ^= 1, {
								testingResults: t.testingResults
							}
						})
					}, n.toogleShowTestManual = function(e) {
						n.setState(function(t) {
							return t.testingResults[e].showTestManual ^= 1, {
								testingResults: t.testingResults
							}
						})
					}, n.setHardwareInBusy = function(e) {
						n.setState(function(t) {
							return {
								hardwareInBusy: e
							}
						})
					}, n.state = {
						value: 0,
						editBoot: !1,
						choosedBoot: null,
						scenarioTestsGlobal: [],
						openCreateBootView: !1,
						bootSocket: null,
						hardwareInBusy: !1,
						testingResults: [],
						connectToDeviceStatus: {
							type: null,
							port: null
						}
					}, n.notificationDOMRef = o.a.createRef(), n
				}
				return Object(d.a)(t, e), Object(l.a)(t, [{
					key: "render",
					value: function() {
						var e = this,
							t = (this.props.classes, this.state.value);
						return console.log("mainApp re-render"), o.a.createElement("div", null, o.a.createElement(D.Provider, {
							value: {
								scenarioTestsGlobal: this.state.scenarioTestsGlobal,
								setStoreScenarioTestsToGlobal: this.setStoreScenarioTestsToGlobal,
								choosedBootHandle: this.choosedBootHandle,
								setCreateBootView: this.setCreateBootView,
								socketIoContext: this.context.bootSocket,
								setHardwareInBusy: this.setHardwareInBusy,
								hardwareInBusy: this.state.hardwareInBusy,
								addNotification: this.addNotification,
								testingResults: this.state.testingResults,
								pushNewTestingResult: this.pushNewTestingResult,
								toogleShowDetailTestingResult: this.toogleShowDetailTestingResult,
								toogleShowTestManual: this.toogleShowTestManual,
								setConnectToDeviceStatus: this.setConnectToDeviceStatus,
								connectToDeviceStatus: this.state.connectToDeviceStatus
							}
						}, o.a.createElement(h.a, {
							position: "static",
							color: "default"
						}, o.a.createElement(S.a, {
							value: t,
							onChange: this.handleChange,
							indicatorColor: "primary",
							textColor: "primary",
							variant: "scrollable",
							scrollButtons: "auto"
						}, o.a.createElement(E.a, {
							label: "Automation Test"
						}), o.a.createElement(E.a, {
							label: "Manual Test"
						}), o.a.createElement(E.a, {
							label: "Testing Result"
						}))), o.a.createElement(ee.a, {
							ref: this.notificationDOMRef
						}), 0 === t ? o.a.createElement(re, null, o.a.createElement(v.t, null, o.a.createElement(Z, null)), o.a.createElement(v.t, null, o.a.createElement(v.g, {
							sm: "12"
						}, e.state.editBoot || e.state.openCreateBootView ? o.a.createElement(Q, null) : e.state.choosedBoot ? o.a.createElement(v.b, {
							color: "mdb-color",
							outline: !0,
							onClick: function() {
								e.setState(function(e) {
									return {
										editBoot: !0
									}
								})
							},
							style: {
								width: "100%"
							}
						}, "Choosed Boot: ", e.state.choosedBoot, ".", " ", o.a.createElement("b", null, "Would You Like To Edit Boot ?")) : o.a.createElement(v.b, {
							color: "mdb-color",
							outline: !0,
							onClick: function() {
								e.setState(function(e) {
									return {
										editBoot: !0
									}
								})
							},
							style: {
								width: "100%"
							}
						}, o.a.createElement("b", null, " Create Boot ? "))), o.a.createElement(v.g, null))) : 1 === t ? o.a.createElement(o.a.Fragment, null, o.a.createElement(re, null, " ", o.a.createElement(oe, null))) : 2 === t ? o.a.createElement(re, null, " ", o.a.createElement(ne, null)) : void 0))
					}
				}]), t
			}(o.a.Component);
			se.contextType = R;
			var ie = Object(b.a)(function(e) {
					return {
						root: {
							flexGrow: 1,
							width: "100%",
							backgroundColor: e.palette.background.paper
						}
					}
				})(se),
				ce = n(29),
				le = n(254),
				ue = n(253),
				me = n(252),
				de = n(257),
				ge = n(207),
				pe = n(255),
				fe = n(256),
				Te = n(261);
			Object(me.a)(function(e) {
				return {
					paper: {
						position: "absolute",
						width: 400,
						backgroundColor: e.palette.background.paper,
						boxShadow: e.shadows[5],
						padding: e.spacing(4),
						outline: "none"
					}
				}
			});

			function be() {
				return Math.round(20 * Math.random()) - 10
			}

			function he() {
				var e = 50 + be(),
					t = 50 + be();
				return {
					top: "".concat(e, "%"),
					left: "".concat(t, "%"),
					transform: "translate(-".concat(e, "%, -").concat(t, "%)")
				}
			}
			var Se = Object(me.a)(function(e) {
					return {
						root: {
							flexGrow: 1
						},
						wrapper: {
							position: "relative",
							margin: e.spacing(1)
						},
						Toolbar: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "flex-start",
							padding: "24px"
						},
						cirlcularProcess: {
							marginLeft: "24px"
						},
						efuseConfig: {
							display: "flex",
							flexDirection: "column",
							alignContent: "flex-end"
						},
						startAllTestingButton: {
							marginLeft: "auto",
							width: "30%"
						},
						timeTest: {
							marginLeft: "20px",
							marginRight: "24px"
						},
						devicesFailNum: {
							marginLeft: "60px",
							marginRight: "24px"
						},
						testingDeviceCards: {
							marginTop: "24px",
							paddingRight: "24px",
							display: "flex",
							flexGrow: 1,
							flexDirection: "column"
						},
						card: {
							display: "flex",
							flexDirection: "column",
							backgroundColor: "#f5f5f5"
						},
						contentsInCard: {
							display: "flex",
							padding: "10px",
							justifyContent: "space-between"
						},
						detailContentCard: {
							marginLeft: "10px",
							display: "flex",
							padding: e.spacing(3, 2),
							flexDirection: "column"
						},
						detailContentCardFull: {
							marginLeft: "10px",
							display: "flex",
							flexGrow: 1,
							padding: e.spacing(3, 2),
							flexDirection: "column"
						},
						attributeTestingDeviceTitle: {},
						attributeTestingDeviceValue: {},
						detailInfoModal: {
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							justifyItems: "center",
							backgroundColor: e.palette.background.paper,
							boxShadow: e.shadows[5],
							padding: e.spacing(4),
							outline: "none"
						},
						serialDataInModal: {
							height: "300px",
							overflowY: "scroll"
						},
						closeModalButton: {
							display: "flex",
							backgroundColor: "#2196f3"
						}
					}
				}),
				Ee = function(e) {
					var t = Se(),
						n = Object(a.useContext)(R),
						r = 1,
						s = 2,
						i = 3,
						c = 4,
						l = 5,
						u = Object(a.useState)([]),
						m = Object(ce.a)(u, 2),
						d = m[0],
						g = m[1],
						p = Object(a.useState)({
							model: "",
							productionVersion: "",
							productionLine: ""
						}),
						f = Object(ce.a)(p, 2),
						T = f[0],
						b = f[1],
						S = Object(a.useState)(!1),
						E = Object(ce.a)(S, 2),
						x = E[0],
						v = E[1],
						k = Object(a.useState)(!1),
						C = Object(ce.a)(k, 2),
						w = C[0],
						B = C[1],
						I = Object(a.useState)({
							serialData: "",
							scenarioTestingRunning: {}
						}),
						D = Object(ce.a)(I, 2),
						N = D[0],
						A = D[1],
						O = Object(a.useState)(null),
						j = Object(ce.a)(O, 2),
						M = (j[0], j[1]),
						L = Object(a.useState)(0),
						P = Object(ce.a)(L, 2),
						G = P[0],
						Q = (P[1], Object(a.useState)(0)),
						H = Object(ce.a)(Q, 2),
						V = (H[0], H[1]),
						W = o.a.useState(he),
						K = (Object(ce.a)(W, 1)[0], Object(a.useState)(o.a.createRef())),
						q = Object(ce.a)(K, 1)[0],
						U = function(e, t, n, a) {
							q.current.addNotification({
								title: e,
								message: t,
								type: n,
								insert: "top",
								container: "top-right",
								animationIn: ["animated", "fadeIn"],
								animationOut: ["animated", "fadeOut"],
								dismiss: {
									duration: parseInt(a)
								},
								dismissable: {
									click: !0
								}
							})
						};
					Object(a.useEffect)(function() {
						return n.bootSocket.emit("runAutomaticFactoryQcTool"), n.bootSocket.on("disconnect", function() {
								console.log("disconnect"), U("Connect To Server Status", "disconnected", "danger", "20000")
							}), n.bootSocket.on("reconnect_attempt", function() {
								console.log("on socket reconnect_attempt"), U("Connect To Server Status", "try reconnect", "danger", "20000")
							}), n.bootSocket.on("efuseConfig", function(e) {
								b(e)
							}), n.bootSocket.on("pushNotification", function(e) {
								U(e.title, e.message, e.type, e.duration)
							}), n.bootSocket.on("testingRunningStatus", function(e) {
								g(e)
							}), n.bootSocket.on("onTestingProcessRunning", function(e) {
								!0 === e ? (V(0), M(setInterval(function() {
									console.log("testing timer in running....."), V(function(e) {
										V(e + 1)
									})
								}, 1e3))) : M(function(e) {
									clearInterval(e)
								}), B(e), console.log("setOnTestingProcessRunning: ", e)
							}),
							function() {}
					}, []), Object(a.useEffect)(function() {
						var e = d.find(function(e) {
							return e.testingStatus === s
						});
						e && A(e)
					}, [d]);
					var _ = o.a.createElement("ul", {
							className: t.efuseConfig
						}, o.a.createElement(y.a, {
							variant: "h6"
						}, "Efuse Config"), Object.keys(T).map(function(e) {
							return o.a.createElement("li", {
								key: F()
							}, o.a.createElement(y.a, null, e, ": ", T[e]))
						})),
						J = o.a.createElement(h.a, {
							color: "default",
							position: "static"
						}, o.a.createElement(le.a, {
							className: t.Toolbar
						}, _, o.a.createElement("div", {
							className: t.startAllTestingButton
						}, o.a.createElement(ue.a, {
							disabled: w || !d.find(function(e) {
								return e.testingStatus === r
							}),
							variant: "contained",
							color: "primary",
							onClick: function() {
								n.bootSocket.emit("startTest", "")
							},
							style: {
								backgroundColor: "#2196f3"
							}
						}, w ? o.a.createElement("div", null, "Testing Running... ", o.a.createElement(pe.a, {
							size: 20,
							className: t.cirlcularProcess
						})) : "Test All Devices")), o.a.createElement(y.a, {
							variant: "h6",
							className: t.devicesFailNum
						}, "Num device Fail: ", G))),
						z = function(e) {
							var n = "";
							return e.testingStatus === s ? n = "#fffa00" : e.testingStatus === l ? n = "#42f545" : e.testingStatus !== i && e.testingStatus !== c || (n = "#ea450e"), o.a.createElement("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									backgroundColor: n,
									marginTop: "10px"
								}
							}, e.testingStatus === s ? o.a.createElement(fe.a, null) : null, o.a.createElement("div", {
								className: t.contentsInCard
							}, Object.keys(e).map(function(n) {
								return "serialPort" === n ? o.a.createElement(ge.a, {
									className: t.detailContentCardFull
								}, o.a.createElement(y.a, {
									variant: "h6",
									className: t.attributeTestingDeviceTitle
								}, "Device At Port"), o.a.createElement(y.a, {
									variant: "subtile1",
									className: t.attributeTestingDeviceValue
								}, e[n])) : "key" === n || "serialData" == n ? void 0 : "macAddress" === n ? o.a.createElement(ge.a, {
									className: t.detailContentCardFull
								}, o.a.createElement(y.a, {
									variant: "h6",
									className: t.attributeTestingDeviceTitle
								}, n), o.a.createElement(y.a, {
									variant: "subtile1",
									className: t.attributeTestingDeviceValue
								}, e[n])) : "timeTestingRunning" === n ? o.a.createElement(ge.a, {
									className: t.detailContentCard
								}, o.a.createElement(y.a, {
									variant: "h6",
									className: t.attributeTestingDeviceTitle
								}, "Time Count"), o.a.createElement(y.a, {
									variant: "subtile1",
									className: t.attributeTestingDeviceValue
								}, e[n].toString())) : "testingStatus" === n ? o.a.createElement(ge.a, {
									className: t.detailContentCard
								}, o.a.createElement(y.a, {
									variant: "h6",
									className: t.attributeTestingDeviceTitle
								}, "Status"), o.a.createElement("div", null, o.a.createElement(y.a, {
									variant: "subtile1",
									className: t.attributeTestingDeviceValue
								}, (a = e[n]) === r ? "Waiting..." : a === s ? "In Testing...." : a === i ? "Testing Fail" : a === l ? "Testing Pass" : a === c ? "Device Broken" : void 0), o.a.createElement(ue.a, {
									color: "primary",
									onClick: function() {
										v(!0)
									}
								}, "See Detail Running"))) : o.a.createElement(ge.a, {
									className: t.detailContentCard
								}, o.a.createElement(y.a, {
									variant: "h6",
									className: t.attributeTestingDeviceTitle
								}, n), o.a.createElement(y.a, {
									variant: "subtile1",
									className: t.attributeTestingDeviceValue
								}, e[n]));
								var a
							})))
						},
						Y = o.a.createElement("div", {
							className: t.testingDeviceCards
						}, d.map(function(e) {
							return z(e)
						})),
						X = o.a.createElement(Te.a, {
							open: x,
							onClose: function() {
								v(!1)
							}
						}, o.a.createElement("div", {
							className: t.detailInfoModal
						}, o.a.createElement(y.a, {
							variant: "h6",
							id: "modal-title"
						}, "Serial Data"), o.a.createElement("textarea", {
							className: t.serialDataInModal,
							value: N.serialData
						}), o.a.createElement("div", null, o.a.createElement(ue.a, {
							className: t.closeModalButton,
							onClick: function() {
								v(!1)
							}
						}, "Close Modal")))),
						Z = o.a.createElement("div", null, Y);
					return o.a.createElement("div", {
						className: t.root
					}, o.a.createElement(de.a, null), J, o.a.createElement(ee.a, {
						ref: q
					}), Z, X)
				},
				ye = {
					background: "inherit",
					backgroundColor: "rgba(215, 211, 204, 1)"
				},
				xe = function(e) {
					function t(e) {
						var n;
						return Object(c.a)(this, t), (n = Object(u.a)(this, Object(m.a)(t).call(this, e))).renderBoxInfos = function() {
							return o.a.createElement(v.d, {
								style: {
									marginTop: "20px"
								}
							}, o.a.createElement(v.e, null, o.a.createElement(v.f, {
								style: ye
							}, "Th\xf4ng Tin Thi\u1ebft B\u1ecb"), o.a.createElement(v.n, null, n.state.boxInfos.map(function(e) {
								return o.a.createElement(v.o, {
									key: e.key,
									style: {
										marginTop: "10px"
									}
								}, o.a.createElement(v.t, null, o.a.createElement(v.g, null, o.a.createElement("h5", null, e.infoName, ": ")), o.a.createElement(v.g, {
									align: "center",
									style: {
										width: "100%"
									}
								}, " ", e.extractedData)))
							}))))
						}, n.renderEfuseInBox = function() {
							return o.a.createElement("div", null, o.a.createElement("h4", null, "Efuse In Device: "), " ", n.state.boxInfos.efuse)
						}, n.addNotification = function(e, t, a, o) {
							n.notificationDOMRef.current.addNotification({
								title: e,
								message: t,
								type: a,
								insert: "top",
								container: "top-right",
								animationIn: ["animated", "fadeIn"],
								animationOut: ["animated", "fadeOut"],
								dismiss: {
									duration: parseInt(o)
								},
								dismissable: {
									click: !0
								}
							})
						}, n.renderAutomaticTestingResult = function() {
							return o.a.createElement(v.d, {
								style: {
									marginTop: "20px"
								}
							}, o.a.createElement(v.e, null, o.a.createElement(v.f, null, "Automatic Testing Result ", o.a.createElement("br", null), "MacAddress: ", n.state.automaticTestingResult.macAddress, o.a.createElement("br", null), "Day Test: ", n.state.automaticTestingResult.date.toString(), " ", o.a.createElement("br", null), "Testing Time: ", n.state.automaticTestingResult.testingTime), o.a.createElement(v.n, null, n.state.automaticTestingResult.scenarioTestResults.map(function(e) {
								return o.a.createElement(v.o, {
									style: {
										marginBottom: "10px"
									},
									color: e.result ? "success" : "danger"
								}, o.a.createElement(v.g, null, e.name), o.a.createElement(v.g, {
									align: "right",
									style: {
										width: "100%"
									}
								}, e.result ? o.a.createElement(v.a, {
									color: "success"
								}, "PASS") : o.a.createElement(v.a, {
									color: "danger"
								}, "FAIL")))
							})), o.a.createElement("hr", null), function() {
								if (n.state.automaticTestingResult.scenarioTestResults.length > 0) return o.a.createElement(v.a, {
									color: n.state.automaticTestingResult.isAutomaticTestingPass ? "success" : !1 === n.state.automaticTestingResult.isAutomaticTestingPass ? "danger" : void 0,
									style: {
										width: "100%"
									}
								}, o.a.createElement("h5", null, " K\u1ebft Qu\u1ea3:", n.state.automaticTestingResult.isAutomaticTestingPass ? o.a.createElement(o.a.Fragment, null, "PASS") : o.a.createElement(o.a.Fragment, null, "FAIL")))
							}()))
						}, n.renderManualTestingResult = function() {
							return o.a.createElement(v.d, {
								style: {
									marginTop: "20px"
								}
							}, o.a.createElement(v.e, null, o.a.createElement(v.f, null, "Product Assembly Test Result", o.a.createElement("br", null), "DayTest: ", n.state.manualTestingResult.dayTest, " ", o.a.createElement("br", null), "TestingTime: ", n.state.manualTestingResult.testingTime), o.a.createElement(v.n, null, n.state.manualTestingResult.data.map(function(e) {
								return o.a.createElement(v.o, {
									color: e.result ? "success" : "danger"
								}, o.a.createElement(v.t, null, o.a.createElement(v.g, {
									md: "10"
								}, e.infoName), o.a.createElement(v.g, {
									align: "right"
								}, e.result ? o.a.createElement(v.a, {
									color: "success"
								}, "PASS") : o.a.createElement(v.a, {
									color: "danger"
								}, "FAIL"))))
							})), o.a.createElement("hr", null), o.a.createElement(v.a, {
								color: n.state.manualTestingResult.result ? "success" : "danger",
								style: {
									width: "100%"
								}
							}, o.a.createElement("h5", null, "K\u1ebft Qu\u1ea3: ", n.state.manualTestingResult.result ? o.a.createElement(o.a.Fragment, null, "PASS") : o.a.createElement(o.a.Fragment, null, "FAIL")))))
						}, n.renderAutomaticTesting = function() {
							return o.a.createElement(v.d, {
								style: {
									marginTop: "20px"
								}
							}, o.a.createElement(v.e, null, o.a.createElement(v.f, {
								style: ye
							}, "PCB Automatic Test"), o.a.createElement(v.n, null, n.state.automationTest.map(function(e) {
								return e.inTesting ? o.a.createElement(v.o, {
									style: {
										backgroundColor: "red"
									},
									key: e.key
								}, o.a.createElement("h4", {
									align: "center"
								}, " In Testing... ")) : o.a.createElement(v.o, {
									color: e.result ? "success" : "warning",
									style: {},
									key: e.key
								}, o.a.createElement(v.t, null, o.a.createElement(v.g, null, e.name), o.a.createElement(v.g, {
									align: "right",
									style: {
										width: "100%"
									}
								}, !0 === e.result ? o.a.createElement(v.a, {
									color: "success"
								}, "PASS") : !1 === e.result ? o.a.createElement(v.a, {
									color: "danger"
								}, "FAIL") : void 0)))
							})), o.a.createElement("hr", null), function() {
								var e = !0,
									t = !1,
									a = void 0;
								try {
									for (var r, s = n.state.automationTest[Symbol.iterator](); !(e = (r = s.next()).done); e = !0) {
										var i = r.value,
											c = !0;
										if (n.state.automationTest.map(function(e) {
												null === e.result && (c = !1)
											}), !c) return;
										if (!1 === i.result) return o.a.createElement(v.a, {
											color: "danger",
											style: {
												width: "100%"
											}
										}, " ", o.a.createElement("h5", null, " K\u1ebft Qu\u1ea3: Fail"), " ")
									}
								} catch (l) {
									t = !0, a = l
								} finally {
									try {
										e || null == s.return || s.return()
									} finally {
										if (t) throw a
									}
								}
								return o.a.createElement(v.a, {
									color: "success",
									style: {
										width: "100%"
									}
								}, " ", o.a.createElement("h5", null, "K\u1ebft Qu\u1ea3: Pass"), " ")
							}()))
						}, n.renderDevicesList = function() {
							return o.a.createElement(v.i, null, o.a.createElement(v.l, {
								outline: !0,
								color: "mdb-color",
								icon: "caret-down"
							}, n.state.devicesTestingStack.length, " :Devices Waiting For Test"), o.a.createElement(v.k, null, n.state.devicesTestingStack.map(function(e) {
								return o.a.createElement(v.j, null, e)
							})))
						}, n.renderInTestingDeviceStatus = function() {
							return o.a.createElement("div", null, "Device in Testing: ", o.a.createElement(v.a, {
								color: "success"
							}, n.state.inTestingDeviceStatus.macAddress), o.a.createElement("br", null), "Port: ", o.a.createElement(v.a, {
								color: n.state.inTestingDeviceStatus.deviceBroken ? "danger" : "success"
							}, n.state.inTestingDeviceStatus.serialPort), o.a.createElement("br", null), "Efuse In Device: ", o.a.createElement(v.a, {
								color: "success"
							}, n.state.inTestingDeviceStatus.efuse), o.a.createElement("nbsp", null), " ", o.a.createElement("nbsp", null), o.a.createElement("nbsp", null), o.a.createElement("nbsp", null), o.a.createElement("nbsp", null), o.a.createElement("nbsp", null), "Battery Level: ", o.a.createElement(v.a, {
								color: "success"
							}, n.state.inTestingDeviceStatus.batteryLevel, " mV"))
						}, n.renderChooseModeTestingButton = function() {
							return o.a.createElement(o.a.Fragment, null, o.a.createElement(v.i, null, o.a.createElement(v.l, {
								outline: (!0).toString(),
								color: "mdb-color",
								nav: !0,
								caret: !0
							}, "Choose Mode Testing"), o.a.createElement(v.k, null, o.a.createElement(v.j, {
								onClick: function() {
									n.context.bootSocket.emit("setQctoolForProductionTestMode", "automaticTestMode"), n.setState(function(e) {
										return e.chooseModeTestingButton.automationTest = !0, e.chooseModeTestingButton.manualTest = !1, {
											chooseModeTestingButton: e.chooseModeTestingButton
										}
									})
								}
							}, "Automation Test"), o.a.createElement(v.j, {
								onClick: function() {
									n.context.bootSocket.emit("setQctoolForProductionTestMode", "manualTestMode"), n.setState(function(e) {
										return e.chooseModeTestingButton.automationTest = !1, e.chooseModeTestingButton.manualTest = !0, {
											chooseModeTestingButton: e.chooseModeTestingButton
										}
									})
								}
							}, "Manual Test"))), o.a.createElement(v.b, {
								disabled: !!n.state.hardwareBusy,
								color: "mdb-color",
								onClick: function() {
									n.state.chooseModeTestingButton.automationTest ? n.context.bootSocket.emit("runAutomaticTest", {
										scenarioTests: n.state.theBoot,
										bootName: n.state.bootName
									}) : n.context.bootSocket.emit("runManualTest", n.state.productAssemblyTest)
								}
							}, n.state.chooseModeTestingButton.automationTest ? o.a.createElement(o.a.Fragment, null, "Run Automation Test") : o.a.createElement(o.a.Fragment, null, "Run Manual Test")), o.a.createElement(v.b, {
								outline: !0,
								color: "warning",
								disabled: n.state.waitingForSetRetestResult,
								onClick: function() {
									n.setState(function(e) {
										return {
											waitingForSetRetestResult: !0
										}
									}), O.a.get("/api/reTest?macAddress=".concat(n.state.inTestingDeviceStatus.macAddress)).then(function(e) {
										200 === e.status && (console.log("ReTest SuccessFull: ", e), n.setState(function(e) {
											return e.automaticTestingResult.scenarioTestResults = null, e.manualTestingResult.data = null, {
												automaticTestingResult: e.automaticTestingResult,
												manualTestingResult: e.manualTestingResult
											}
										}))
									}).catch(function(e) {
										console.log(e)
									}).finally(function() {
										console.log("set waitingForTestingResult to false"), n.setState(function(e) {
											return {
												waitingForSetRetestResult: !1
											}
										})
									})
								}
							}, "Re-Test"))
						}, n.renderManualTesting = function() {
							return o.a.createElement(v.d, {
								style: {
									marginTop: "20px"
								}
							}, o.a.createElement(v.e, null, o.a.createElement(v.f, {
								style: ye
							}, "Product Assembly Test ", o.a.createElement("br", null), " (Th\u1ef1c Hi\u1ec7n M\u1ee5c D\u01b0\u1edbi \u0110\xe2y V\xe0 Tr\u1ea3 L\u1eddi C\xe2u H\u1ecfi \u1ede M\u1ee5c ", o.a.createElement("strong", null, "Confirm Questions"), ")"), o.a.createElement(v.n, null, n.state.productAssemblyTest.map(function(e) {
								return e.inTesting ? o.a.createElement(v.o, {
									style: {
										backgroundColor: "red"
									}
								}, o.a.createElement("h4", {
									className: "white-text"
								}, e.infoName, "checkOTASuccess" === e.name || "changeToUrlDefault" === e.name || "checkWifiConnection" === e.name || "sendKey" === e.name ? o.a.createElement("strong", null, " H\xe3y Ch\u1edd Ch\xfang T\xf4i ", e.infoName, ": ", Math.floor(parseInt(e.restTestingTime) / 1e3), " S") : o.a.createElement("strong", null, " Nhanh L\xean B\u1ea1n C\xf2n L\u1ea1i: ", Math.floor(parseInt(e.restTestingTime) / 1e3), " S"))) : null !== e.testingResult ? o.a.createElement(v.o, {
									color: e.testingResult ? "success" : "danger"
								}, o.a.createElement(v.t, null, o.a.createElement(v.g, null, e.infoName), o.a.createElement(v.g, {
									align: "right",
									style: {
										width: "100%"
									}
								}, function() {
									if (e.inTesting);
									else {
										if (!1 === e.testingResult && !e.inTesting) return o.a.createElement(v.a, {
											color: "danger"
										}, " FAIL ");
										if (!0 === e.testingResult) return o.a.createElement(v.a, {
											color: "success"
										}, " PASS ")
									}
								}()))) : o.a.createElement(v.o, {
									color: "warning"
								}, e.infoName)
							})), o.a.createElement("hr", null), function() {
								var e = !0;
								if (n.state.productAssemblyTest.map(function(t) {
										if (null === t.testingResult) return e = !1
									}), e) return n.state.productAssemblyTest.find(function(e) {
									return !1 === e.testingResult
								}) ? o.a.createElement(v.a, {
									color: "danger",
									style: {
										width: "100%"
									}
								}, o.a.createElement("h5", null, "K\u1ebft Qu\u1ea3: Fail")) : o.a.createElement(v.a, {
									color: "success",
									style: {
										width: "100%"
									}
								}, o.a.createElement("h5", null, "K\u1ebft Qu\u1ea3: Pass"))
							}()))
						}, n.testerAnswerConfirmQuestion = function(e, t) {
							n.setState(function(n) {
								return {
									confirmQuestions: n.confirmQuestions.map(function(n) {
										return n.question === e.question && (console.log("user choose confirmQuestion.question: ", n.question), n.answer = t), n
									})
								}
							}), n.context.bootSocket.emit("userConfirmQuestion", {
								type: e.type,
								answer: t
							})
						}, n.renderConfirmQuestions = function() {
							return o.a.createElement(v.d, {
								style: {
									marginTop: "20px"
								}
							}, o.a.createElement(v.e, null, o.a.createElement(v.f, {
								style: ye
							}, "Confirm Questions"), o.a.createElement(v.n, null, n.state.confirmQuestions.map(function(e) {
								return "img" !== e.questionType ? o.a.createElement(v.o, {
									style: {
										marginBottom: "10px"
									},
									key: e.key,
									color: "warning"
								}, o.a.createElement("strong", null, "Q1: "), e.question, " ", o.a.createElement("br", null), o.a.createElement("div", {
									style: {
										display: "flex"
									}
								}, o.a.createElement("div", null, "C\xf3: ", o.a.createElement("input", {
									type: "checkbox",
									style: {
										transform: "scale(1.6)",
										marginLeft: "10px"
									},
									checked: e.answer,
									disabled: !n.state.productAssemblyTest.find(function(e) {
										return 1 == e.inTesting && "testRGBLed" == e.name
									}),
									onChange: n.testerAnswerConfirmQuestion.bind(null, e, !0)
								})), o.a.createElement("div", {
									style: {
										marginLeft: "50px"
									}
								}, "Kh\xf4ng: ", o.a.createElement("input", {
									type: "checkbox",
									style: {
										marginLeft: "10px",
										transform: "scale(1.6)"
									},
									checked: !e.answer && null !== e.answer,
									disabled: !n.state.productAssemblyTest.find(function(e) {
										return 1 == e.inTesting && "testRGBLed" == e.name
									}),
									onChange: n.testerAnswerConfirmQuestion.bind(null, e, !1)
								})))) : o.a.createElement(o.a.Fragment, null, o.a.createElement(v.o, {
									key: e.key,
									color: "warning"
								}, o.a.createElement("strong", null, "Q2: "), e.question, o.a.createElement("br", null), o.a.createElement("img", {
									src: e.imgUrl,
									alt: "Cap Image"
								}), o.a.createElement("br", null), o.a.createElement("div", {
									style: {
										display: "flex"
									}
								}, o.a.createElement("div", null, "C\xf3: ", o.a.createElement("input", {
									checked: e.answer,
									disabled: !n.state.productAssemblyTest.find(function(e) {
										return 1 == e.inTesting && "confirmImageQuality" == e.name
									}),
									onChange: n.testerAnswerConfirmQuestion.bind(null, e, !0),
									type: "checkbox",
									style: {
										marginLeft: "10px",
										transform: "scale(1.6)"
									}
								})), o.a.createElement("div", {
									style: {
										marginLeft: "50px"
									}
								}, "Kh\xf4ng: ", o.a.createElement("input", {
									checked: !e.answer && null !== e.answer,
									disabled: !n.state.productAssemblyTest.find(function(e) {
										return 1 == e.inTesting && "confirmImageQuality" == e.name
									}),
									onChange: n.testerAnswerConfirmQuestion.bind(null, e, !1),
									type: "checkbox",
									style: {
										marginLeft: "10px",
										transform: "scale(1.6)"
									}
								})))))
							}))))
						}, n.renderEfuseSetup = function() {
							return o.a.createElement("div", null, o.a.createElement("h4", null, "Efuse To Burn: "), "Model: ", n.state.efuseSetup.model, " ", o.a.createElement("br", null), "production_line: ", n.state.efuseSetup.production_line, " ", o.a.createElement("br", null), "version_code: ", n.state.efuseSetup.version_code, "    ", o.a.createElement("br", null))
						}, n.renderLogDebug = function() {
							return o.a.createElement(v.d, null, o.a.createElement(v.e, null, o.a.createElement(v.f, {
								style: ye
							}, "Log Debug"), o.a.createElement(Y, null)))
						}, n.renderRunningActions = function() {
							return o.a.createElement(o.a.Fragment, null, "Render Running Actions")
						}, n.setBeginTest = function(e) {
							n.setState(function(t) {
								t.manualTestingResult.data = null, t.automaticTestingResult.scenarioTestResults = null;
								var n = t.automationTest.map(function(e) {
										return e.inTesting = !1, e.result = null, e
									}),
									a = t.productAssemblyTest.map(function(e) {
										return e.restTestingTime = null, e.inTesting = !1, e.extractedData = null, e.testingResult = null, e
									});
								console.log("state.inTestingDeviceStatus: ", t.inTestingDeviceStatus), t.inTestingDeviceStatus.serialPort = e.testAtSerialPort, t.inTestingDeviceStatus.serialPort = e.testAtSerialPort, t.inTestingDeviceStatus.macAddress = e.macAddress, t.inTestingDeviceStatus.deviceBroken = e.deviceBroken, t.inTestingDeviceStatus.efuse = e.efuse, t.inTestingDeviceStatus.batteryLevel = e.batteryLevel;
								var o = t.confirmQuestions.map(function(e) {
									return e.answer = null, "img" === e.questionType && (e.imgUrl = null), e
								});
								return {
									automationTest: n,
									inTestingDeviceStatus: t.inTestingDeviceStatus,
									productAssemblyTest: a,
									deviceBroken: !1,
									confirmQuestions: o,
									manualTestingResult: t.manualTestingResult,
									automaticTestingResult: t.automaticTestingResult
								}
							})
						}, n.state = {
							boxInfos: [{
								infoName: "efuse",
								key: F(),
								extractedData: null,
								queryDataCommand: null
							}, {
								infoName: "date",
								key: F(),
								extractedData: null,
								queryDataCommand: null
							}, {
								infoName: "pvc",
								key: F(),
								extractedData: null
							}, {
								infoName: "mech_rev",
								key: F(),
								extractedData: null
							}, {
								infoName: "el_rev",
								key: F(),
								extractedData: null
							}, {
								infoName: "year",
								key: F(),
								extractedData: null
							}, {
								infoName: "week",
								key: F(),
								extractedData: null
							}, {
								infoName: "mac",
								key: F(),
								extractedData: null
							}],
							productAssemblyTest: [{
								infoName: "Send Key",
								name: "sendKey",
								key: F(),
								extractedData: null,
								findLogContainSubString: ["user button pressed"],
								extractStringRegexQueries: [],
								testingResult: null,
								timeoutError: 3e3,
								inTesting: !1,
								restTestingTime: null
							}, {
								infoName: "H\xe3y B\u1ea5m User Button",
								name: "testUserButton",
								key: F(),
								extractedData: null,
								findLogContainSubString: ["user button pressed"],
								extractStringRegexQueries: [],
								testingResult: null,
								timeoutError: 3e3,
								restTestingTime: null,
								inTesting: !1
							}, {
								infoName: "H\xe3y Ch\xedch Reset Button",
								name: "testResetButton",
								key: F(),
								extractedData: null,
								findLogContainSubString: ["user button pressed"],
								extractStringRegexQueries: [],
								testingResult: null,
								timeoutError: 3e3,
								inTesting: !1,
								restTestingTime: null
							}, {
								infoName: "Check Wifi Connection",
								name: "checkWifiConnection",
								key: F(),
								extractedData: null,
								findLogContainSubString: ["user button pressed"],
								extractStringRegexQueries: [],
								testingResult: null,
								timeoutError: 3e3,
								restTestingTime: null,
								inTesting: !1
							}, {
								infoName: "Led Hi\u1ec3n Th\u1ecb \u0110\u1ee7 7 m\xe0u kh\xf4ng ? (Tr\u1ea3 L\u1eddi T\u1ea1i Q1) )",
								name: "testRGBLed",
								key: F(),
								extractedData: null,
								findLogContainSubString: ["user button pressed"],
								extractStringRegexQueries: [],
								testingResult: null,
								timeoutError: 3e3,
								inTesting: !1,
								restTestingTime: null
							}, {
								infoName: "H\xe3y M\u1edf M\u1ed9t N\u1eafp Gi\u1ea3",
								name: "testOpenFakeCap",
								key: F(),
								extractedData: null,
								findLogContainSubString: ["user button pressed"],
								extractStringRegexQueries: [],
								testingResult: null,
								timeoutError: 3e3,
								inTesting: !1,
								restTestingTime: null
							}, {
								infoName: "Ch\u1ea5t L\u01b0\u1ee3ng \u1ea2nh C\xf3 \u0110\u1ea1t Ti\xeau Chu\u1ea9n Kh\xf4ng ?(Tr\u1ea3 L\u1eddi \u1ede Q2)",
								name: "confirmImageQuality",
								key: F(),
								extractedData: null,
								findLogContainSubString: ["user button pressed"],
								extractStringRegexQueries: [],
								testingResult: null,
								timeoutError: 3e3,
								inTesting: !1,
								restTestingTime: null
							}, {
								infoName: "Hall Sensor Ho\u1ea1t \u0110\u1ed9ng T\u1ed1t",
								name: "checkHallSensor",
								key: F(),
								extractedData: null,
								findLogContainSubString: ["user button pressed"],
								extractStringRegexQueries: [],
								testingResult: null,
								timeoutError: 3e3,
								inTesting: !1,
								restTestingTime: null
							}, {
								infoName: "Battery Ho\u1ea1t \u0110\u1ed9ng T\u1ed1t",
								name: "checkBattery",
								key: F(),
								extractedData: null,
								findLogContainSubString: ["in charging current: "],
								extractStringRegexQueries: ["/d{1,4}"],
								testingResult: null,
								timeoutError: 3e3,
								inTesting: !1,
								restTestingTime: null
							}, {
								infoName: "Check Update OTA",
								name: "checkOTASuccess",
								key: F(),
								extractedData: null,
								findLogContainSubString: ["user button pressed"],
								extractStringRegexQueries: [],
								testingResult: null,
								timeoutError: 3e3,
								inTesting: !1,
								restTestingTime: null
							}],
							confirmQuestions: [{
								question: "Led C\xf3 Hi\u1ec3n Th\u1ecb \u0110\u01b0\u1ee3c 7 M\xe0u Kh\xf4ng?",
								type: "confirmRGBLedQuality",
								key: F(),
								answer: null
							}, {
								questionType: "img",
								type: "confirmImageQuality",
								question: "B\u1ee9c H\xecnh D\u01b0\u1edbi \u0110\xe2y C\xf3 \u0110\u1ea1t Ti\u1ec3u Chu\u1ea9n Kh\xf4ng ?",
								key: F(),
								imgUrl: null,
								answer: null
							}],
							devicesTestingStack: [],
							theBoot: null,
							bootName: null,
							inTestingDeviceStatus: {
								macAddress: null,
								key: F(),
								serialPort: null,
								testedDevicesNum: null,
								failtNum: null,
								efuse: null,
								batteryLevel: null,
								nameDeviceFail: []
							},
							chooseModeTestingButton: {
								automationTest: !1,
								manualTest: !0,
								key: F()
							},
							automaticTestingResult: {
								key: F(),
								scenarioTestResults: null,
								bootName: null,
								date: null,
								isAutomaticTestingPass: null
							},
							manualTestingResult: {
								key: F(),
								data: null,
								dayTest: null,
								result: null
							},
							efuseSetup: {
								key: F(),
								model: null,
								production_line: null,
								version_code: null
							},
							automationTest: [],
							deviceBroken: !1,
							hardwareBusy: !1,
							waitingForSetRetestResult: !1,
							shouldPreventTestManual: {
								status: null,
								reason: null
							}
						}, n.notificationDOMRef = o.a.createRef(), n
					}
					return Object(d.a)(t, e), Object(l.a)(t, [{
						key: "componentDidMount",
						value: function() {
							var e = this;
							O.a.get("/api/getFactoryDefaultBoot").then(function(t) {
								console.log("data: ", t), e.setState(function(e) {
									var n = t.data.data.data.trim();
									e.theBoot = JSON.parse(n), e.bootName = JSON.parse(t.data.data.bootName);
									var a = e.theBoot.map(function(e) {
										return {
											name: e.name,
											key: F(),
											inTesting: !1,
											result: null
										}
									});
									return {
										theBoot: e.theBoot,
										automationTest: a,
										bootName: e.bootName
									}
								})
							}), setTimeout(function() {
								e.context.bootSocket.on("disconnect", function() {
									console.log("disconnect"), e.addNotification("Connect To Server Status", "disconnected", "danger", "20000")
								}), e.context.bootSocket.on("reconnect_attempt", function() {
									console.log("on socket reconnect_attempt"), e.addNotification("Connect To Server Status", "try reconnect", "danger", "20000")
								}), e.context.bootSocket.on("getAutomaticTestingResult", function(t) {
									e.setState(function(e) {
										e.automaticTestingResult.scenarioTestResults = [];
										var n = !0,
											a = !1,
											o = void 0;
										try {
											for (var r, s = t.scenarioTestResult[Symbol.iterator](); !(n = (r = s.next()).done); n = !0) {
												var i = r.value;
												e.automaticTestingResult.scenarioTestResults.push({
													name: i.scenarioTestName,
													key: F(),
													result: i.result
												})
											}
										} catch (c) {
											a = !0, o = c
										} finally {
											try {
												n || null == s.return || s.return()
											} finally {
												if (a) throw o
											}
										}
										return e.automaticTestingResult.bootName = t.bootName, e.automaticTestingResult.date = t.date, e.automaticTestingResult.isAutomaticTestingPass = t.isAutomaticTestingPass, e.automaticTestingResult.macAddress = t.macAddress, e.automaticTestingResult.testingTime = t.testingTime, {
											automaticTestingResult: e.automaticTestingResult
										}
									})
								}), e.context.bootSocket.on("getManualTestingResult", function(t) {
									e.setState(function(e) {
										return e.manualTestingResult.data = t.data, e.manualTestingResult.dayTest = t.dayTest, e.manualTestingResult.result = t.result, e.manualTestingResult.testingTime = t.testingTime, {
											manualTestingResult: e.manualTestingResult
										}
									})
								}), e.context.bootSocket.on("testingDevicesStack", function(t) {
									e.setState(function(e) {
										return console.log("testingDevicesStack: ", t), {
											devicesTestingStack: t
										}
									})
								}), e.context.bootSocket.on("efuseSetup", function(t) {
									console.log("get efuse config: ", t), e.setState(function(e) {
										return {
											efuseSetup: t
										}
									})
								}), e.context.bootSocket.on("testingImageCreated", function(t) {
									e.setState(function(e) {
										return {
											confirmQuestions: e.confirmQuestions.map(function(e) {
												return "img" === e.questionType && (e.imgUrl = t), e
											})
										}
									})
								}), e.context.bootSocket.on("inTestingDeviceStatus", function(t) {
									console.log("inTestingDeviceStatus sms: ", t), "begin" === t.phaseTesting ? e.setBeginTest(t) : e.setState(function(e) {
										return e.inTestingDeviceStatus.serialPort = t.testAtSerialPort, e.inTestingDeviceStatus.macAddress = t.macAddress, e.inTestingDeviceStatus.deviceBroken = t.deviceBroken, e.inTestingDeviceStatus.efuse = t.efuse, e.inTestingDeviceStatus.batteryLevel = t.batteryLevel, console.log("setted: state.inTestingDeviceStatus: ", e.inTestingDeviceStatus), {
											inTestingDeviceStatus: e.inTestingDeviceStatus
										}
									})
								}), e.context.bootSocket.on("automaticTestingResultAlert", function(e) {
									console.log("automaticTestingResultAlert: ", e), alert(e)
								}), e.context.bootSocket.on("manualTestingActionStatus", function(t) {
									var n = -1;
									for (var a in e.state.productAssemblyTest)
										if (e.state.productAssemblyTest[a].key === t.manualTestingAction.key) {
											n = a;
											break
										} n > -1 && e.setState(function(e) {
										return "begin" === t.status ? (e.productAssemblyTest[n].inTesting = !0, {
											productAssemblyTest: e.productAssemblyTest
										}) : "waitingForActionFromTester" === t.status ? (e.productAssemblyTest[n].restTestingTime = t.restTestingTime, {
											productAssemblyTest: e.productAssemblyTest
										}) : "end" === t.status ? (e.productAssemblyTest[n].testingResult = t.testingResult, e.productAssemblyTest[n].inTesting = !1, {
											productAssemblyTest: e.productAssemblyTest
										}) : void 0
									})
								}), e.context.bootSocket.on("scenarioTestRunningStatus", function(t) {
									console.log("scenarioTestRunningStatus sms: ", t), e.setState(function(e) {
										for (var n in e.automationTest)
											if (e.automationTest[n].name === t.scenarioTestName) {
												e.automationTest[n].inTesting = t.inTesting, e.automationTest[n].result = t.result;
												break
											} return {
											automaticTesting: e.automaticTesting
										}
									})
								}), e.context.bootSocket.on("boxInfos", function(t) {
									console.log("boxInfos sms: ", t), e.setState(function(e) {
										return {
											boxInfos: t
										}
									})
								}), e.context.bootSocket.on("shouldPreventTestManual", function(t) {
									e.setState(function(e) {
										return {
											shouldPreventTestManual: t
										}
									})
								}), e.context.bootSocket.on("deviceBroken", function(t) {
									console.log(">>>>>>>>>>deviceBoken sms: ", t), e.setBeginTest(t), e.setState(function(e) {
										return e.inTestingDeviceStatus.serialPort = null, e.inTestingDeviceStatus.deviceBroken = !0, e.inTestingDeviceStatus.batteryLevel = null, e.inTestingDeviceStatus.efuse = null, {
											deviceBroken: !0,
											inTestingDeviceStatus: e.inTestingDeviceStatus,
											boxInfos: {}
										}
									})
								}), e.context.bootSocket.on("hardwareBusy", function(t) {
									e.setState(function(e) {
										return {
											hardwareBusy: t
										}
									})
								}), e.context.bootSocket.on("message", function(t) {
									e.addNotification(t.title, t.message, t.type, t.duration)
								}), e.state.chooseModeTestingButton.automationTest ? e.context.bootSocket.emit("setQctoolForProductionTestMode", "automaticTestMode") : e.context.bootSocket.emit("setQctoolForProductionTestMode", "manualTestMode"), e.context.bootSocket.emit("newQctoolGetEfuseConfig", ""), console.log("emited get efuse config")
							}, 2e3), this.context.bootSocket.emit("qctoolFactoryrequestStatusDevice", ""), this.context.bootSocket.emit("turnQctoolToPoductionMode", "")
						}
					}, {
						key: "render",
						value: function() {
							var e = this;
							return o.a.createElement(o.a.Fragment, null, o.a.createElement(ee.a, {
								ref: this.notificationDOMRef
							}), o.a.createElement(v.s, {
								style: {
									backgroundColor: "#fdd835",
									display: "flex"
								}
							}, this.renderInTestingDeviceStatus(), o.a.createElement(v.b, {
								color: "success",
								onClick: function() {
									e.state.inTestingDeviceStatus.macAddress && e.context.bootSocket.emit("printLabel", {
										macAddress: e.state.inTestingDeviceStatus.macAddress
									})
								}
							}, "Print Label"), o.a.createElement(v.b, {
								style: {
									marginRight: "150px"
								},
								color: "success",
								onClick: function() {
									e.context.bootSocket.emit("runManualTest", e.state.productAssemblyTest)
								},
								disabled: this.state.hardwareBusy || !this.state.inTestingDeviceStatus.serialPort || this.state.shouldPreventTestManual.status
							}, e.state.inTestingDeviceStatus.serialPort ? e.state.hardwareBusy ? e.state.hardwareBusy ? o.a.createElement("div", null, "Manual Test Running....") : void 0 : o.a.createElement("div", null, " Run Manual Test ") : o.a.createElement("div", null, "Finding Serial Port..."))), o.a.createElement(v.t, null, o.a.createElement(v.g, {
								style: {
									overflowY: "scroll",
									height: "700px"
								},
								sm: "4"
							}, " ", e.state.automaticTestingResult.scenarioTestResults ? e.renderAutomaticTestingResult() : e.renderAutomaticTesting(), " "), o.a.createElement(v.g, {
								sm: "4"
							}, " ", e.state.manualTestingResult.data ? e.renderManualTestingResult() : e.renderManualTesting()), o.a.createElement(v.g, {
								sm: "4"
							}, this.renderConfirmQuestions(), this.renderLogDebug())))
						}
					}]), t
				}(o.a.Component);
			xe.contextType = R;
			var ve = xe,
				ke = n(258),
				Ce = n(246),
				we = n(87),
				Be = n.n(we),
				Ie = n(88),
				De = n.n(Ie),
				Re = Object(me.a)(function(e) {
					return {
						appBar: {
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "102px",
							widh: "100%",
							backgroundColor: "#F6BC42",
							color: "#000000",
							fontFamily: "Roboto",
							fontSize: "35px",
							lineWeigth: "41px",
							fontWeight: "bold",
							textAlign: "center"
						},
						authenticateSetting: {
							marginTop: "39px",
							marginLeft: "90px",
							display: "flex",
							flexDirection: "column"
						},
						authenticateSettingButtonsGroup: {
							display: "flex",
							flexDirection: "row",
							marginTop: "14px",
							width: "100%"
						},
						endpointSetting: {
							display: "flex",
							flexDirection: "column",
							marginTop: "39px"
						},
						publishToTopicSetting: {
							display: "flex",
							flexDirection: "row"
						},
						publishToTopic: {
							marginTop: "62px",
							marginLeft: "90px",
							display: "flex",
							flexDirection: "column"
						},
						publishToTopicTextField: {
							width: "100%",
							height: "624px",
							boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
							backgroundColor: "#FFFFFF",
							marginTop: "62px"
						},
						subcribeToTopicSetting: {
							marginTop: "39px"
						},
						subscribeToTopic: {
							display: "flex",
							flexDirection: "column",
							marginTop: "62px",
							width: "100%"
						},
						subscribedDataTextField: {
							width: "100%",
							height: "624px",
							boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
							backgroundColor: "#FFFFFF",
							marginTop: "62px"
						},
						header: {
							fontFamily: "Roboto",
							fontStyle: "normal",
							fontWeight: "normal",
							fontSize: "25px",
							lineHeight: "29px",
							color: "#333333",
							height: "40px"
						},
						normalButtonStyle: {
							backgroundColor: "#F6BC42",
							height: "55px",
							width: "187px",
							marginRight: "67px",
							boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"
						},
						normalIcon: {
							height: "55px",
							width: "55px"
						}
					}
				}),
				Ne = function() {
					var e = Re(),
						t = Object(a.useState)(!1);
					Object(a.useState)(!1), Object(a.useState)(!1);
					Object(a.useEffect)(function() {
						return document.body.style = "background: #E5E5E5",
							function() {}
					}, []);
					return o.a.createElement("div", null, o.a.createElement(h.a, {
						position: "static",
						className: e.appBar
					}, "TEST UPLOAD IMAGE WITH MQTT PROTOCOL"), o.a.createElement(ke.a, {
						direction: "row",
						container: !0
					}, o.a.createElement(ke.a, {
						item: !0,
						xs: 6,
						direction: "column"
					}, o.a.createElement("div", {
						className: e.authenticateSetting
					}, o.a.createElement(y.a, {
						className: e.header
					}, "Plase Upload These Files For Authenticating"), o.a.createElement("div", {
						className: e.authenticateSettingButtonsGroup
					}, o.a.createElement(ue.a, {
						variant: "contained",
						className: e.normalButtonStyle
					}, "Upload File"), o.a.createElement(ue.a, {
						variant: "contained",
						className: e.normalButtonStyle
					}, "Upload File"), o.a.createElement(ue.a, {
						variant: "contained",
						className: e.normalButtonStyle
					}, "Upload File"), t ? o.a.createElement(Be.a, {
						className: e.normalIcon
					}) : o.a.createElement(De.a, {
						className: e.normalIcon
					}))), o.a.createElement("div", {
						className: e.publishToTopic
					}, o.a.createElement("div", {
						className: e.publishToTopicSetting
					}, o.a.createElement(J.a, {
						style: {
							width: "100%",
							background: "#FFFFFF",
							boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
							marginRight: "67px"
						},
						label: "Public To Topic, default: asdasdasdadasda",
						variant: "outlined"
					}), o.a.createElement(ue.a, {
						className: e.normalButtonStyle,
						style: {
							marginRight: "0px"
						}
					}, "Published")), o.a.createElement(Ce.a, {
						rows: "20",
						className: e.publishToTopicTextField
					}))), o.a.createElement(ke.a, {
						item: !0,
						xs: 6,
						direction: "column",
						style: {
							paddingLeft: "29px"
						}
					}, o.a.createElement("div", {
						className: e.endpointSetting
					}, o.a.createElement(y.a, {
						className: e.header
					}, "Endpoint Setting"), o.a.createElement("div", {
						style: {
							display: "flex",
							marginTop: "14px",
							flexDirection: "row",
							width: "100%"
						}
					}, o.a.createElement("div", {
						style: {
							width: "100%",
							marginRight: "41px"
						}
					}, o.a.createElement(J.a, {
						style: {
							width: "100%",
							background: "#FFFFFF",
							boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
							height: "55px"
						},
						fullWidth: !1,
						label: "Host Url",
						variant: "outlined"
					})), o.a.createElement("div", {
						style: {
							width: "100%",
							marginRight: "41px"
						}
					}, o.a.createElement(J.a, {
						style: {
							width: "100%",
							background: "#FFFFFF",
							boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
							height: "55px"
						},
						fullWidth: !1,
						label: "Host Url",
						variant: "outlined"
					})))), o.a.createElement("div", {
						className: e.subscribeToTopic
					}, o.a.createElement(J.a, {
						style: {
							width: "100%",
							background: "#FFFFFF",
							boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
							height: "55px"
						},
						fullWidth: !1,
						label: "Subcribe To Topic......",
						variant: "outlined"
					}), o.a.createElement(Ce.a, {
						rows: "20",
						className: e.subscribedDataTextField
					})))))
				},
				Fe = function(e) {
					function t(e) {
						var n;
						Object(c.a)(this, t), (n = Object(u.a)(this, Object(m.a)(t).call(this, e))).storeSerialData = function(e) {
							var t = e;
							n.setState(function(e) {
								return {
									serialData: e.serialData + t
								}
							})
						}, n.setBackupSerialData = function(e) {
							n.setBackupSerialData = e
						}, n.componentDidMount = function() {
							document.title = "QC-TOOL"
						}, n.componentWillMount = function() {}, n.connectSocket = function() {
							var e = T.a.connect("/".concat("bootSocket"));
							e.on("connect", function(e) {
								console.log("serial component connected to socket")
							}), n.setState(function(t) {
								return {
									bootSocket: e
								}
							})
						}, n.state = {
							serialData: "",
							bootSocket: null
						};
						return n.bootSocket = T.a.connect("/".concat("bootSocket")), n.backupSerialData = "", n
					}
					return Object(d.a)(t, e), Object(l.a)(t, [{
						key: "render",
						value: function() {
							return o.a.createElement(g.a, null, o.a.createElement(R.Provider, {
								value: {
									bootSocket: this.bootSocket,
									serialData: this.state.serialData,
									backupSerialData: this.backupSerialData,
									setBackupSerialData: this.setBackupSerialData
								}
							}, o.a.createElement(o.a.Fragment, null, o.a.createElement(p.a, {
								path: "/",
								exact: !0,
								component: ie
							}), o.a.createElement(p.a, {
								path: "/manual-test",
								component: ve
							}), o.a.createElement(p.a, {
								path: "/automatic-test",
								component: Ee
							}), o.a.createElement(p.a, {
								path: "/test-mqtt",
								component: Ne
							}))))
						}
					}]), t
				}(a.Component);
			Object(i.a)();
			s.a.render(o.a.createElement(Fe, null), document.getElementById("root"))
		}
	},
	[
		[142, 1, 2]
	]
]);
//# sourceMappingURL=main.4886ddb3.chunk.js.map