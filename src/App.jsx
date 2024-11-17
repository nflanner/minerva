import { ContentLayout, MonetaryInput } from './components';
import './App.css';

function App() {
  return (
    <ContentLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome to Some Page</h1>
        <p>This is some intro paragraph</p>
      </div>
      <MonetaryInput />
    </ContentLayout>
  );
}

export default App;
