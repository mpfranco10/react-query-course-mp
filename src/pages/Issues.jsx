import { useState } from "react";
import IssuesList from "../components/IssuesList";
import LabelList from "../components/LabelList";
import useLabelsData from "../helpers/useLabelsData";

export default function Issues() {
  const [labels, setLabels] = useState([]);
  const labelsData = useLabelsData();

  return (
    <div>
      <main>
        <section>
          <h1>Issues</h1>
          <IssuesList labelsData={labelsData} labels={labels} />
        </section>
        <aside>
          <LabelList
            labelsData={labelsData}
            selected={labels}
            toggle={(label) =>
              setLabels((currentLabels) =>
                currentLabels.includes(label)
                  ? currentLabels.filter(
                      (currentLabel) => currentLabel !== label
                    )
                  : currentLabels.concat(label)
              )
            }
          />
        </aside>
      </main>
    </div>
  );
}
