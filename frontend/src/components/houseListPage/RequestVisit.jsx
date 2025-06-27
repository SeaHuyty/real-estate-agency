import { useParams } from 'react-router-dom';

const RequestVisit = () => {
    const { id } = useParams();

    return (
        <>
            <h1>Request a Visit for Property {id}</h1>
        </>
    );
}

export default RequestVisit;