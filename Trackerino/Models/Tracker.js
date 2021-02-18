const BaseModel = require('./BaseModel')
const Task = require('./Task')

class Tracker extends BaseModel {
	hidden = [];
	constructor () {
		super()

		this.data = {
			...this.data,
			name: '',
			total_value: 0,	// keep the total value
			items: [],
			...(arguments[0] || {})
		}

		this.initMethods()

		if(!!this.data.items && this.data.items.length > 0) {
			this.data.items = this.data.items.map(itm => {
				return new Task(itm)
			})
		}
	}

	getData () {
		return {
			...this.data,
			items: this.data.items.map(itm => itm.getData())
		}
	}

	add (_entry, _interface) {
		try {
			let value = parseFloat(_entry)
			if(!isNaN(value)) {
				this.data.value += value
				_interface.getAnswer(`${ this.data.name }: ${ value }`)
			} else {
				throw new Error("not a valid value")
			}
		} catch(err) {
			_interface.logError('invalid value')
		}
	}

	remove (_entry, _interface) {
		this.data.items = this.data.items.filter(itm => itm.get('id') != _entry)
	}

	list (_value, _interface) {
		return this.show(_value, _interface)
	}

	show (_value, _interface) {
		let output = []

		output.push(`Value: ${ this.data.total_value }`)

		return output.join("\n")

		for(let _index  = 0; _index < this.data.items.length; _index++) {
			let itm = this.data.items[_index]
			if((_value === 'checked' && !itm.get('is_checked')) || (_value === 'unchecked' && itm.get('is_checked'))) continue;
			output.push([
				itm.get('is_checked') ? '[✅]' : '[  ]',
				`- [${ itm.get('id') }] ${ itm.get('title') }`
			].join("\t"))
		}
		output = [
			`${ this.get('name') } (${ output.length } of ${ this.data.items.length } items)`,
			...output
		]
		return output.join("\n")
	}
}

module.exports = Tracker