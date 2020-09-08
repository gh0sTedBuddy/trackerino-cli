const BaseModel = require('./BaseModel')
const ListItem = require('./ListItem')

class List extends BaseModel {
	hidden = ['oi'];
	constructor () {
		super()

		this.data = {
			...this.data,
			name: '',
			items: [],
			...(arguments[0] || {})
		}

		this.initMethods()

		if(!!this.data.items && this.data.items.length > 0) {
			this.data.items = this.data.items.map(itm => {
				return new ListItem(itm)
			})
		}
	}

	getData () {
		return {
			...this.data,
			items: this.data.items.map(itm => itm.getData())
		}
	}

	check (_entry) {
		for(let _index = 0; _index < this.data.items.length; _index ++) {
			if(this.data.items[_index].get('id') === _entry) {
				this.data.items[_index].set('is_checked', true)
				break
			}
		}
	}

	uncheck (_entry) {
		for(let _index = 0; _index < this.data.items.length; _index ++) {
			if(this.data.items[_index].get('id') === _entry) {
				this.data.items[_index].set('is_checked', false)
				break
			}
		}
	}

	add (_entry) {
		this.data.items.push(new ListItem({
			title: _entry
		}))
	}

	remove (_entry) {
		this.data.items = this.data.items.filter(itm => itm.get('id') != _entry)
	}

	show () {
		let output = [`${ this.get('name') } (${ this.data.items.length } items)`]

		for(let _index  = 0; _index < this.data.items.length; _index++) {
			let itm = this.data.items[_index]
			output.push([
				itm.get('is_checked') ? '[✅]' : '[  ]',
				`- [${ itm.get('id') }] ${ itm.get('title') }`
			].join("\t"))
		}
		return output.join("\n")
	}
}

module.exports = List