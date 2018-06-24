export default function create_uuid() {
	// (Time.now.strftime('%y%m%d%H%M%S%6N') + sprintf('%08d', rand(100000000))).to_i.to_s(36)[0..15]

	const d = new Date()
	const s = (d.getTime()).toString() + ('00000000' + Math.trunc((Math.random() * 100000000)).toString()).slice(-8)

	console.log( s, d.getTime().toString(36), Number.parseInt(s, 10).toString(36) )
	

	return `${d.getTime()}`
}