// // File: src/pages/GroepDetailPage.tsx

// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { getVerhuurperiodes } from '../api/verhuur';
// import type { VerhuurPeriode } from '../api/verhuur/types';
// import LoadingIndicator from '../components/LoadingIndicator';


// const GroepDetailPage: React.FC = () => {
//   const { groepId } = useParams<{ groepId: string }>();
//   const [data, setData] = useState<VerhuurPeriode | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const periodes = await getVerhuurperiodes();
//         const groepData = periodes.find(
//           (r) =>
//             r.groep
//               .toLowerCase()
//               .replace(/\s+/g, '-') === groepId
//         );
//         if (!groepData) {
//           setError('Groep niet gevonden');
//         } else {
//           setData(groepData);
//         }
//       } catch (err: any) {
//         setError('Kan data niet laden');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [groepId]);

//   if (loading) return <LoadingIndicator />;
//   if (error) return <div className="p-4 text-red-500">{error}</div>;

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Detail van {data?.groep}</h2>
//       <pre className="bg-gray-100 p-4 rounded overflow-auto">
//         {JSON.stringify(data, null, 2)}
//       </pre>
//     </div>
//   );
// };

// export default GroepDetailPage;
