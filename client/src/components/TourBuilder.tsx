import { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

type Props = {
  tourId: string;
  naamLocatie: string;
};

const fases = ["voor", "aankomst", "terwijl", "vertrek", "na"] as const;
type Fase = typeof fases[number];

const TourBuilder = ({ tourId, naamLocatie }: Props) => {
  const [activeFase, setActiveFase] = useState<Fase>("voor");

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="p-4 border-b">
        <h1 className="text-xl font-bold">Builder voor: {naamLocatie}</h1>
      </header>

      {/* Body: sidebar, preview, config */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/5 border-r p-4 overflow-y-auto">
          <h3 className="font-semibold mb-2">Componenten</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="p-2 border rounded cursor-move">Titel</li>
            <li className="p-2 border rounded cursor-move">Paragraaf</li>
            <li className="p-2 border rounded cursor-move">Afbeelding</li>
            <li className="p-2 border rounded cursor-move">Checklist</li>
          </ul>
        </div>

        {/* Smartphone Preview */}
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="w-64 h-[560px] bg-white border rounded-xl shadow-lg p-4 overflow-auto">
            <p className="text-center text-gray-400">Mobiele preview</p>
            {/* Hier komt straks je tour-renderer */}
          </div>
        </div>

        {/* Config pane */}
        <div className="w-1/4 border-l p-4 overflow-y-auto">
          <h3 className="font-semibold mb-2">Configuratie</h3>
          <p className="text-sm text-gray-600">Selecteer een component in de preview om hier te bewerken.</p>
        </div>
      </div>

      {/* Fase-tabs onderaan */}
      <footer className="border-t p-2">
        <Tabs selectedIndex={fases.indexOf(activeFase)} onSelect={idx => setActiveFase(fases[idx])}>
          <TabList className="flex justify-around">
            {fases.map((f, idx) => (
              <Tab key={f} className={`py-1 px-3 rounded-t-md cursor-pointer ${activeFase === f ? 'bg-white -mt-1 shadow' : 'bg-gray-200'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Tab>
            ))}
          </TabList>
          {fases.map(f => (
            <TabPanel key={f} className="p-4">
              <p className="text-gray-600">Fase <strong>{f}</strong> — hier kun je content toevoegen.</p>
            </TabPanel>
          ))}
        </Tabs>
      </footer>
    </div>
  );
};

export default TourBuilder;
