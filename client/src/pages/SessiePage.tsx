import { useParams } from "react-router-dom";

const SessiePage = () => {
  const { groepId } = useParams();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">Sessiepagina</h2>
      <p><strong>Groep:</strong> {groepId?.replace("-", " ")}</p>
      <p><strong>Sessie-ID:</strong> #{groepId?.slice(0, 6).toUpperCase()}</p>
      {/* hier kan je later inventaris of forms tonen */}
    </div>
  );
};

export default SessiePage;
