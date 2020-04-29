function customiseDrawControlText() {
	L.drawLocal = {
		draw: {
			toolbar: {
				// #TODO: this should be reorganized where actions are nested in actions
				// ex: actions.undo  or actions.cancel
				actions: {
					title: 'Cancel',
					text: ''
				},
				finish: {
					title: '',
					text: ''
				},
				undo: {
					title: '',
					text: ''
				},
				buttons: {
					polyline: '',
					polygon: 'Polygon',
					rectangle: 'Rectangle',
					circle: 'Circle',
					marker: '100 Km COVID Circle',
					circlemarker: ''
				}
			},
			handlers: {
				circle: {
					tooltip: {
						start: ''
					},
					radius: ''
				},
				circlemarker: {
					tooltip: {
						start: ''
					}
				},
				marker: {
					tooltip: {
						start: '100Km COVID  Circke: Drop at Takeoff location'
					}
				},
				polygon: {
					tooltip: {
						start: '',
						cont: '',
						end: ''
					}
				},
				polyline: {
					error: '<strong>Error:</strong> shape edges cannot cross!',
					tooltip: {
						start: 'Click to start drawing line.',
						cont: 'Click to continue drawing line.',
						end: 'Click last point to finish line.'
					}
				},
				rectangle: {
					tooltip: {
						start: ''
					}
				},
				simpleshape: {
					tooltip: {
						end: 'Release mouse to finish drawing.'
					}
				}
			}
		},
		edit: {
			toolbar: {
				actions: {
				save: {
					title: 'Save changes',
					text: 'Save'
				},
				cancel: {
					title: 'Cancel editing, discards all changes',
					text: 'Cancel'
				},
				clearAll: {
					title: 'Clear all layers',
					text: 'Clear All'
				}
				},
				buttons: {
				edit: 'Edit layers',
				editDisabled: 'No layers to edit',
				remove: 'Delete layers',
				removeDisabled: 'No layers to delete'
				}
		},
		handlers: {
			edit: {
				tooltip: {
					text: 'Drag handles or markers to edit features.',
					subtext: 'Click cancel to undo changes.'
				}
			},
			remove: {
				tooltip: {
				text: 'Click on a feature to remove.'
				}
			}
		}
		}
	};
}
