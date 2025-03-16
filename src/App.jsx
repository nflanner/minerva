import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ContentLayout } from './components';
import { HomePage, IncomePage, ExpensePage, LoanPage, BudgetParametersPage, ReviewPage, ScriptPage } from './pages';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ContentLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/expenses" element={<ExpensePage />} />
            <Route path="/loans" element={<LoanPage />} />
            <Route path="/budgetParameters" element={<BudgetParametersPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/script" element={<ScriptPage />} />
          </Routes>
        </ContentLayout>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
