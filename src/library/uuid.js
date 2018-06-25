// (Time.now.strftime('%y%m%d%H%M%S%6N') + sprintf('%08d', rand(100000000))).to_i.to_s(36)[0..15]

export default function create_uuid() {
	return Array.apply(null, Array(16)).map(item => Math.round(35 * Math.random()).toString(36)).join('')
}