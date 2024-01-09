export default function LabelList({ selected, toggle, labelsData }) {
  const { data, isLoading } = labelsData;

  return (
    <div className="labels">
      {isLoading ? (
        <p>Loading....</p>
      ) : (
        <ul>
          {data.map((label) => (
            <li key={label.id}>
              <button
                onClick={() => {
                  toggle(label.id);
                }}
                className={`${selected.includes(label.id) ? "selected" : ""} ${
                  label.color
                }`}
              >
                {label.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
