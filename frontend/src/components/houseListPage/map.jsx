import 'leaflet/dist/leaflet.css'

export const map = () => {
    const position = 
    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3715.500078304363!2d104.90952747481705!3d11.558332988641945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951165ff4e519%3A0xe27c9eb725bf4eb!2sNational%20Olympic%20Stadium!5e1!3m2!1sen!2skh!4v1747629770168!5m2!1sen!2skh" width="100%" height="100%" style={{border:0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

    return (
        <div className="w-full h-[500px]">
            {position}
        </div>
    )
}
export default map;