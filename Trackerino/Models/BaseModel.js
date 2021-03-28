const shortid = require('shortid')
const moment = require('moment')

class BaseModel {
	constructor () {
		this.data = {
			id: shortid.generate(),
			created_at: moment().unix(),
			updated_at: moment().unix(),
			deleted_at: null,
			of_type: this.constructor.name
		}
	}

	getData () {
		return this.data
	}

	get (key, _default = null) {
		if(typeof this.data[key] === undefined) {
			return  _default
		}
		return this.data[key]
	}

	set (key, value) {
		try {
			let intValue = parseInt(value)

			value = intValue
		} catch (err) {

		}
		this.data[key] = value
		this.data.updated_at = moment().unix()
	}

	initMethods () {
		let keys = Object.keys(this.data).filter( key => {
			return [
				'id', 'created_at', 'updated_at', 'deleted_at', 'of_type'
			].indexOf(key) < 0
		} )

		for(let _index = 0; _index < keys.length; _index++) {
			let key = keys[_index]
			if(!this[key] && 'object' !== typeof this.data[key]) {
				this[key] = (new_val) => {
					if(new_val !== this.get(key)) {
						this.set(key, new_val)
						return true
					}
					return false
				}
			}

			this['delete'] = () => {
				this.data.deleted_at = moment().unix()
			}
		}
	}
}

module.exports = BaseModel