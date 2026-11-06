import { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Bell,
  Boxes,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  IndianRupee,
  LayoutDashboard,
  Menu,
  Minus,
  PackagePlus,
  Plus,
  Search,
  ShoppingBasket,
  ShoppingCart,
  Sparkles,
  TriangleAlert,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';

const initialProducts = [
  { id: 1, name: 'Amul Taaza Milk', category: 'Dairy', price: 28, stock: 8, unit: 'pouch', image: 'photo-1563636619-e9143da7973b' },
  { id: 2, name: 'Aashirvaad Atta', category: 'Staples', price: 265, stock: 4, unit: '5 kg', image: 'photo-1574323347407-f5e1ad6d020b' },
  { id: 3, name: 'Tata Salt', category: 'Staples', price: 24, stock: 32, unit: 'kg', image: 'photo-1626200419199-391ae4be7a41' },
  { id: 4, name: 'Parle-G Gold', category: 'Snacks', price: 20, stock: 2, unit: 'pack', image: 'photo-1558961363-fa8fdf82db35' },
  { id: 5, name: 'Fortune Sunflower Oil', category: 'Cooking oil', price: 145, stock: 16, unit: 'litre', image: 'photo-1474979266404-7eaacbcd87c5' },
  { id: 6, name: 'Maggi Masala Noodles', category: 'Snacks', price: 14, stock: 27, unit: 'pack', image: 'photo-1569718212165-3a8278d5f624' },
];

const initialTransactions = [
  { id: 'BILL-2481', customer: 'Walk-in customer', time: '10:42 am', amount: 286, method: 'UPI' },
  { id: 'BILL-2480', customer: 'Meena Sharma', time: '10:28 am', amount: 142, method: 'Cash' },
  { id: 'BILL-2479', customer: 'Walk-in customer', time: '10:11 am', amount: 518, method: 'UPI' },
];

const initialCustomers = [
  { id: 1, initials: 'MS', name: 'Meena Sharma', type: 'Regular customer', visits: 18, total: 8420, phone: '' },
  { id: 2, initials: 'RK', name: 'Rahul Kumar', type: 'Regular customer', visits: 12, total: 5680, phone: '' },
  { id: 3, initials: 'AS', name: 'Anita Singh', type: 'New this month', visits: 7, total: 2140, phone: '' },
  { id: 4, initials: 'VD', name: 'Vikram Das', type: 'Regular customer', visits: 24, total: 11960, phone: '' },
];

const navigation = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'billing', label: 'Billing & POS', icon: ShoppingBasket },
  { id: 'inventory', label: 'Inventory', icon: Boxes, badge: '3' },
  { id: 'customers', label: 'Customers', icon: UsersRound },
  { id: 'reports', label: 'Reports', icon: ChartNoAxesCombined },
];

const pageTitles = {
  overview: ['Good morning, Keshav', "Here's what's happening at your store today."],
  billing: ['Billing & POS', 'Create a bill and keep the queue moving.'],
  inventory: ['Inventory', 'Keep your shelves stocked and your records up to date.'],
  customers: ['Customers', 'Know your regulars and the value they bring.'],
  reports: ['Reports', 'A clear view of how your store is doing.'],
};

function money(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

function ProductImage({ product }) {
  return (
    <span className={`product-image product-art product-art-${product.category.toLowerCase().replaceAll(' ', '-')}`} aria-hidden="true"><ShoppingBasket size={15} /></span>
  );
}

function App() {
  const [activePage, setActivePage] = useState('overview');
  const [products, setProducts] = useState(initialProducts);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [customers, setCustomers] = useState(initialCustomers);
  const [salesToday, setSalesToday] = useState(12840);
  const [billsToday, setBillsToday] = useState(48);
  const [chartRange, setChartRange] = useState('This week');
  const [query, setQuery] = useState('');
  const [showPos, setShowPos] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [notice, setNotice] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const filteredProducts = useMemo(() => products.filter((product) =>
    `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase()),
  ), [products, query]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const lowStock = products.filter((product) => product.stock <= 8);
  const [title, subtitle] = pageTitles[activePage];
  const today = new Date();
  const dateLabel = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(today).toUpperCase();
  const shortDate = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(today);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2800);
  }

  function openPos() {
    setCart([]);
    setShowPos(true);
  }

  function addToCart(product) {
    const currentQuantity = cart.find((item) => item.id === product.id)?.quantity ?? 0;
    if (currentQuantity >= product.stock) {
      showNotice(`Only ${product.stock} ${product.unit} available`);
      return;
    }
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function changeQuantity(productId, delta) {
    const item = cart.find((entry) => entry.id === productId);
    if (delta > 0 && item && item.quantity >= item.stock) {
      showNotice(`Only ${item.stock} ${item.unit} available`);
      return;
    }
    setCart((current) => current
      .map((item) => item.id === productId ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  }

  function completeSale(paymentMethod, customerName = 'Walk-in customer') {
    if (!cart.length) return;
    const newTransaction = {
      id: `BILL-${2482 + transactions.length - initialTransactions.length}`,
      customer: customerName,
      time: 'Just now',
      amount: cartTotal,
      method: paymentMethod,
    };
    setTransactions((current) => [newTransaction, ...current]);
    setSalesToday((current) => current + cartTotal);
    setBillsToday((current) => current + 1);
    setCustomers((current) => current.map((customer) => customer.name === customerName
      ? { ...customer, visits: customer.visits + 1, total: customer.total + cartTotal }
      : customer));
    setProducts((current) => current.map((product) => {
      const sold = cart.find((item) => item.id === product.id);
      return sold ? { ...product, stock: Math.max(0, product.stock - sold.quantity) } : product;
    }));
    setShowPos(false);
    setActivePage('overview');
    setCart([]);
    showNotice('Bill created successfully');
  }

  function createProduct(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name')?.toString().trim();
    if (!name) return;
    const added = {
      id: Date.now(),
      name,
      category: formData.get('category')?.toString() || 'Other',
      price: Number(formData.get('price')) || 0,
      stock: Number(formData.get('stock')) || 0,
      unit: formData.get('unit')?.toString() || 'unit',
      image: 'photo-1542838132-92c53300491e',
    };
    setProducts((current) => [added, ...current]);
    setShowProductForm(false);
    showNotice(`${name} added to inventory`);
  }

  function createCustomer(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name')?.toString().trim();
    if (!name) return;
    const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    const customer = {
      id: Date.now(),
      initials,
      name,
      type: 'New customer',
      visits: 0,
      total: 0,
      phone: formData.get('phone')?.toString().trim() || '',
    };
    setCustomers((current) => [customer, ...current]);
    setShowCustomerForm(false);
    showNotice(`${name} added to customers`);
  }

  function setPage(page) {
    setActivePage(page);
    setMobileNavOpen(false);
    setQuery('');
  }

  return (
    <div className="app-shell">
      {mobileNavOpen && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><ShoppingBasket size={21} strokeWidth={2.2} /></div>
          <div><strong>Keshav<span>Store</span></strong><small>STORE DESK</small></div>
          <button className="icon-button sidebar-close" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}><X size={18} /></button>
        </div>

        <div className="store-switcher">
          <div className="store-avatar">KS</div>
          <div className="store-copy"><strong>Keshav Stores</strong><small>Jaipur, Rajasthan</small></div>
          <ChevronDown size={16} />
        </div>

        <div className="nav-caption">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {navigation.map(({ id, label, icon: Icon, badge }) => (
            <button key={id} className={`nav-link ${activePage === id ? 'nav-active' : ''}`} onClick={() => setPage(id)}>
              <Icon size={18} strokeWidth={1.9} />
              <span>{label}</span>
              {badge && <span className="nav-badge">{lowStock.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={17} /></div>
            <div><strong>Need a hand?</strong><small>We're here for you</small></div>
            <ChevronRight size={16} />
          </div>
          <button className="profile-row" onClick={() => showNotice('Store settings are up to date')}>
            <div className="profile-avatar">K</div>
            <div className="profile-copy"><strong>Keshav Sharma</strong><small>Store owner</small></div>
            <ChevronDown size={16} />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumb"><span>Store desk</span><ChevronRight size={14} /><strong>{navigation.find((item) => item.id === activePage)?.label || 'Overview'}</strong></div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input value={query} onChange={(event) => {
                const nextQuery = event.target.value;
                setQuery(nextQuery);
                if (nextQuery.trim()) setActivePage('inventory');
              }} placeholder="Search products..." aria-label="Search products" />
            </label>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => showNotice(`${lowStock.length} products need a restock`)}><Bell size={19} /><i /></button>
            <div className="today-chip"><CalendarDays size={15} /><span>Today, {shortDate}</span></div>
          </div>
        </header>

        <div className="page-content">
          <section className="page-heading">
            <div><div className="eyebrow"><span className="eyebrow-dot" /> {dateLabel}</div><h1>{title}</h1><p>{subtitle}</p></div>
            <div className="heading-actions">
              <button className="button button-secondary" onClick={() => setShowProductForm(true)}><PackagePlus size={17} />Add product</button>
              <button className="button button-primary" onClick={openPos}><Plus size={18} />New sale</button>
            </div>
          </section>

          {activePage === 'overview' && <Overview products={products} lowStock={lowStock} transactions={transactions} salesToday={salesToday} billsToday={billsToday} chartRange={chartRange} onChartRangeChange={setChartRange} onPos={openPos} onInventory={() => setPage('inventory')} onAddProduct={() => setShowProductForm(true)} />}
          {activePage === 'inventory' && <Inventory products={filteredProducts} onAddProduct={() => setShowProductForm(true)} query={query} />}
          {activePage === 'customers' && <Customers customers={customers} onAddCustomer={() => setShowCustomerForm(true)} />}
          {activePage === 'reports' && <Reports transactions={transactions} salesToday={salesToday} billsToday={billsToday} />}
          {activePage === 'billing' && <Billing transactions={transactions} onPos={openPos} />}
        </div>
      </main>

      {showPos && <PosModal products={products} customers={customers} cart={cart} total={cartTotal} onAdd={addToCart} onChange={changeQuantity} onClose={() => setShowPos(false)} onComplete={completeSale} />}
      {showProductForm && <ProductModal onClose={() => setShowProductForm(false)} onSubmit={createProduct} />}
      {showCustomerForm && <CustomerModal onClose={() => setShowCustomerForm(false)} onSubmit={createCustomer} />}
      {notice && <div className="toast"><span><Check size={15} /></span>{notice}</div>}
    </div>
  );
}

function Overview({ products, lowStock, transactions, salesToday, billsToday, chartRange, onChartRangeChange, onPos, onInventory, onAddProduct }) {
  const chartSeries = {
    Today: { amount: money(salesToday), comparison: 'sales so far today', bars: [30, 42, 38, 56, 49, 72, 65, 84, 76, 100, 81, 92], labels: ['8 am', '10 am', '12 pm', '2 pm', '4 pm', '6 pm'] },
    'This week': { amount: '₹68,420', comparison: 'compared to last week', bars: [34, 49, 42, 63, 54, 72, 59, 77, 65, 86, 70, 94, 72, 82, 67, 91, 76, 100, 79, 88, 70, 96, 79, 91], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    'This month': { amount: '₹2,64,180', comparison: 'compared to last month', bars: [40, 31, 52, 45, 59, 48, 65, 60, 75, 58, 68, 84, 71, 79, 64, 87, 77, 95, 72, 89, 80, 100, 83, 91], labels: ['1', '5', '10', '15', '20', '25', '30'] },
  }[chartRange];
  return (
    <>
      <section className="metrics-grid" aria-label="Today's store metrics">
        <MetricCard label="Today's sales" value={money(salesToday)} change="12.8%" positive detail="vs. yesterday" icon={IndianRupee} iconClass="metric-green" />
        <MetricCard label="Bills generated" value={String(billsToday)} change="8.2%" positive detail="vs. yesterday" icon={ShoppingCart} iconClass="metric-amber" />
        <MetricCard label="Average bill value" value="₹267.50" change="2.4%" positive detail="vs. yesterday" icon={Banknote} iconClass="metric-blue" />
        <MetricCard label="Items running low" value={String(lowStock.length).padStart(2, '0')} change="Needs attention" detail="across your store" icon={TriangleAlert} iconClass="metric-coral" alert />
      </section>

      <section className="dashboard-grid">
        <div className="panel sales-panel">
          <div className="panel-header">
            <div><div className="panel-kicker">YOUR STORE AT A GLANCE</div><h2>Sales overview</h2></div>
            <select className="select-button" aria-label="Sales chart time range" value={chartRange} onChange={(event) => onChartRangeChange(event.target.value)}><option>Today</option><option>This week</option><option>This month</option></select>
          </div>
          <div className="sales-summary"><strong>{chartSeries.amount}</strong><span className="trend-up"><ArrowUpRight size={15} /> 9.6%</span><small>{chartSeries.comparison}</small></div>
          <div className="chart-wrap">
            <div className="chart-y-labels"><span>₹15k</span><span>₹10k</span><span>₹5k</span><span>₹0</span></div>
            <div className="bar-chart" role="img" aria-label="Sales increased throughout the week">
              {[0, 1, 2, 3].map((line) => <div key={line} className="chart-gridline" style={{ bottom: `${line * 33.33}%` }} />)}
              <div className="bars">{chartSeries.bars.map((height, index) => <div key={index} className={`bar ${index === chartSeries.bars.length - 7 ? 'bar-highlight' : ''}`} style={{ height: `${height}%` }} title={`Sales activity ${index + 1}`} />)}</div>
            </div>
          </div>
          <div className="chart-x-labels">{chartSeries.labels.map((label) => <span key={label}>{label}</span>)}</div>
        </div>

        <div className="panel quick-panel">
          <div className="panel-header"><div><div className="panel-kicker">KEEP THINGS MOVING</div><h2>Quick actions</h2></div><Sparkles className="sparkle-icon" size={18} /></div>
          <button className="quick-action quick-sale" onClick={onPos}><span className="quick-icon"><ShoppingBasket size={19} /></span><span><strong>Create a new bill</strong><small>Ring up a customer sale</small></span><ChevronRight size={17} /></button>
          <button className="quick-action" onClick={onAddProduct}><span className="quick-icon quick-icon-amber"><PackagePlus size={19} /></span><span><strong>Add to inventory</strong><small>Update your product list</small></span><ChevronRight size={17} /></button>
          <div className="store-image-card">
            <div className="store-image-art" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
            <div className="store-image-overlay"><span>YOUR STORE, SIMPLIFIED</span><strong>Good business starts with a good day.</strong></div>
          </div>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="panel inventory-panel">
          <div className="panel-header"><div><div className="panel-kicker">DON'T LET THE SHELVES GO EMPTY</div><h2>Needs a restock <span className="count-pill">{lowStock.length}</span></h2></div><button className="text-button" onClick={onInventory}>View inventory <ChevronRight size={15} /></button></div>
          {lowStock.length ? <div className="restock-list">{lowStock.slice(0, 4).map((product) => <div className="restock-row" key={product.id}><ProductImage product={product} /><div className="product-copy"><strong>{product.name}</strong><small>{product.category} · {money(product.price)} / {product.unit}</small></div><span className={`stock-status ${product.stock <= 4 ? 'stock-critical' : ''}`}>{product.stock} left</span></div>)}</div> : <div className="empty-state">Everything is well stocked. Nice work.</div>}
          <button className="restock-cta" onClick={onInventory}><TriangleAlert size={16} />Review low stock <ChevronRight size={15} /></button>
        </div>

        <div className="panel transactions-panel">
          <div className="panel-header"><div><div className="panel-kicker">FRESH OFF THE COUNTER</div><h2>Recent bills</h2></div><button className="text-button" onClick={onPos}>New bill <ChevronRight size={15} /></button></div>
          <div className="transaction-list">{transactions.slice(0, 4).map((transaction) => <div className="transaction-row" key={transaction.id}><div className="transaction-icon"><ReceiptMark /></div><div className="transaction-copy"><strong>{transaction.customer}</strong><small>{transaction.id} · {transaction.time}</small></div><div className="transaction-amount"><strong>{money(transaction.amount)}</strong><small>{transaction.method}</small></div></div>)}</div>
          <div className="transaction-footer"><span><span className="live-dot" />Sales sync is up to date</span><Clock3 size={14} /> Updated just now</div>
        </div>
      </section>
      <div className="dashboard-footnote"><span>All figures are for today, in Indian Rupees.</span><button onClick={() => onInventory(products)}>See all {products.length} products <ArrowUpRight size={14} /></button></div>
    </>
  );
}

function ReceiptMark() {
  return <CreditCard size={17} />;
}

function MetricCard({ label, value, change, positive, detail, icon: Icon, iconClass, alert }) {
  return (
    <article className="metric-card"><div className={`metric-icon ${iconClass}`}><Icon size={19} strokeWidth={1.9} /></div><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><div className="metric-detail">{alert ? <span className="attention-label"><span />{change}</span> : <span className={positive ? 'trend-up' : 'trend-down'}>{positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{change}</span>}<span>{detail}</span></div></article>
  );
}

function Inventory({ products, onAddProduct, query }) {
  return (
    <section className="panel full-panel inventory-page">
      <div className="panel-header inventory-page-header"><div><div className="panel-kicker">PRODUCT CATALOGUE</div><h2>All products <span className="count-pill">{products.length}</span></h2></div><button className="button button-primary" onClick={onAddProduct}><Plus size={17} />Add product</button></div>
      <div className="inventory-table-wrap"><table className="inventory-table"><thead><tr><th>PRODUCT</th><th>CATEGORY</th><th>PRICE</th><th>IN STOCK</th><th>STATUS</th></tr></thead><tbody>
        {products.map((product) => <tr key={product.id}><td><div className="table-product"><ProductImage product={product} /><div><strong>{product.name}</strong><small>SKU-{String(product.id).slice(-4)}</small></div></div></td><td>{product.category}</td><td className="table-price">{money(product.price)} <small>/ {product.unit}</small></td><td>{product.stock} <span className="table-muted">{product.unit}</span></td><td><span className={`table-status ${product.stock <= 4 ? 'status-low' : product.stock <= 8 ? 'status-watch' : 'status-good'}`}><span />{product.stock <= 4 ? 'Low stock' : product.stock <= 8 ? 'Restock soon' : 'In stock'}</span></td></tr>)}
        {!products.length && <tr><td colSpan="5" className="no-results">{query ? `No products match “${query}”.` : 'No products yet.'}</td></tr>}
      </tbody></table></div>
      <div className="table-footer">Showing {products.length} products <span>Inventory updates automatically when a bill is created.</span></div>
    </section>
  );
}

function Billing({ transactions, onPos }) {
  return (
    <section className="panel full-panel inventory-page">
      <div className="panel-header inventory-page-header">
        <div><div className="panel-kicker">SALES RECORD</div><h2>All bills <span className="count-pill">{transactions.length}</span></h2></div>
        <button className="button button-primary" onClick={onPos}><Plus size={17} />Create bill</button>
      </div>
      <div className="inventory-table-wrap">
        <table className="inventory-table">
          <thead><tr><th>BILL</th><th>CUSTOMER</th><th>TIME</th><th>AMOUNT</th><th>PAYMENT</th></tr></thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="table-price">{transaction.id}</td>
                <td>{transaction.customer}</td>
                <td>{transaction.time}</td>
                <td className="table-price">{money(transaction.amount)}</td>
                <td><span className="table-status status-good">{transaction.method}</span></td>
              </tr>
            ))}
            {!transactions.length && <tr><td colSpan="5" className="no-results">No bills yet. Create your first bill to get started.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="table-footer">{transactions.length} bills recorded <span>New sales appear here after checkout.</span></div>
    </section>
  );
}

function Customers({ customers, onAddCustomer }) {
  return (
    <section className="panel full-panel customer-panel">
      <div className="panel-header">
        <div><div className="panel-kicker">YOUR NEIGHBOURHOOD, CLOSER</div><h2>Customers <span className="count-pill">{customers.length}</span></h2></div>
        <button className="button button-secondary" onClick={onAddCustomer}><UserRound size={16} />Add customer</button>
      </div>
      <div className="customer-list">
        {customers.map((customer) => (
          <div className="customer-row" key={customer.id}>
            <span className="customer-avatar">{customer.initials}</span>
            <div className="customer-name"><strong>{customer.name}</strong><small>{customer.phone || customer.type}</small></div>
            <span className="customer-visits">{customer.visits} visits</span>
            <span className="customer-spend">{money(customer.total)}<small>total spent</small></span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CustomerModal({ onClose, onSubmit }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="form-modal" role="dialog" aria-modal="true" aria-labelledby="customer-title">
        <header className="modal-header">
          <div><div className="panel-kicker">CUSTOMER BOOK</div><h2 id="customer-title">Add a customer</h2></div>
          <button className="icon-button" aria-label="Close" onClick={onClose}><X size={20} /></button>
        </header>
        <form onSubmit={onSubmit}>
          <label className="field-label">Customer name<input name="name" placeholder="e.g. Meena Sharma" required autoFocus /></label>
          <label className="field-label">Phone number (optional)<input name="phone" type="tel" inputMode="tel" placeholder="10-digit mobile number" /></label>
          <div className="form-actions">
            <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="button button-primary"><Plus size={16} />Save customer</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Reports({ transactions, salesToday, billsToday }) {
  const total = transactions.reduce((sum, item) => sum + item.amount, 0);
  return <section className="reports-view"><div className="report-intro"><div className="report-icon"><ChartNoAxesCombined size={21} /></div><div><h2>Your store is finding its rhythm.</h2><p>Sales are up today. Keep an eye on fast-moving essentials to stay ahead of demand.</p></div></div><div className="report-cards"><article className="panel report-card"><span>Today's sales</span><strong>{money(salesToday)}</strong><small><ArrowUpRight size={14} /> Live total</small></article><article className="panel report-card"><span>Bills today</span><strong>{billsToday}</strong><small><ArrowUpRight size={14} /> Updated after checkout</small></article><article className="panel report-card"><span>Recent bills total</span><strong>{money(total)}</strong><small>Across {transactions.length} transactions</small></article></div><div className="panel report-note"><div className="report-note-icon"><Sparkles size={18} /></div><div><strong>A small tip for a better week</strong><p>Milk, biscuits and cooking oil are your everyday essentials. Check stock before the evening rush.</p></div></div></section>;
}

function PosModal({ products, customers, cart, total, onAdd, onChange, onClose, onComplete }) {
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [selectedCustomer, setSelectedCustomer] = useState('Walk-in customer');
  const matchingProducts = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="pos-modal" role="dialog" aria-modal="true" aria-labelledby="pos-title">
        <header className="modal-header">
          <div><div className="panel-kicker">KESHAV STORES</div><h2 id="pos-title">New sale</h2></div>
          <button className="icon-button" aria-label="Close" onClick={onClose}><X size={20} /></button>
        </header>
        <div className="pos-body">
          <div className="pos-products">
            <label className="modal-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a product..." autoFocus /></label>
            <div className="pos-product-list">
              {matchingProducts.map((product) => {
                const quantityInCart = cart.find((item) => item.id === product.id)?.quantity ?? 0;
                return (
                  <button className="pos-product" key={product.id} disabled={quantityInCart >= product.stock} onClick={() => onAdd(product)}>
                    <ProductImage product={product} />
                    <span className="pos-product-copy"><strong>{product.name}</strong><small>{product.stock - quantityInCart} {product.unit} available</small></span>
                    <span className="pos-product-price">{money(product.price)}</span><Plus size={16} />
                  </button>
                );
              })}
              {!matchingProducts.length && <p className="no-results">No products found.</p>}
            </div>
          </div>
          <div className="cart-panel">
            <div className="cart-heading"><h3>Current bill</h3><span>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>
            {cart.length ? (
              <div className="cart-lines">
                {cart.map((item) => (
                  <div className="cart-line" key={item.id}>
                    <div><strong>{item.name}</strong><small>{money(item.price)} each</small></div>
                    <div className="quantity-control">
                      <button aria-label={`Remove one ${item.name}`} onClick={() => onChange(item.id, -1)}><Minus size={13} /></button>
                      <span>{item.quantity}</span>
                      <button aria-label={`Add one ${item.name}`} disabled={item.quantity >= item.stock} onClick={() => onChange(item.id, 1)}><Plus size={13} /></button>
                    </div>
                    <strong>{money(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="cart-empty"><ShoppingBasket size={26} /><strong>Your bill is empty</strong><span>Add products to get started</span></div>
            )}
            <div className="cart-total"><span>Subtotal</span><strong>{money(total)}</strong></div>
            <label className="customer-select">Customer
              <select value={selectedCustomer} onChange={(event) => setSelectedCustomer(event.target.value)}>
                <option>Walk-in customer</option>
                {customers.map((customer) => <option key={customer.id}>{customer.name}</option>)}
              </select>
            </label>
            <div className="payment-method">
              <span>Payment method</span>
              <div>
                <button type="button" className={`payment-option ${paymentMethod === 'UPI' ? 'payment-selected' : ''}`} aria-pressed={paymentMethod === 'UPI'} onClick={() => setPaymentMethod('UPI')}><CreditCard size={15} />UPI</button>
                <button type="button" className={`payment-option ${paymentMethod === 'Cash' ? 'payment-selected' : ''}`} aria-pressed={paymentMethod === 'Cash'} onClick={() => setPaymentMethod('Cash')}><Banknote size={15} />Cash</button>
              </div>
            </div>
            <button className="button button-primary checkout-button" disabled={!cart.length} onClick={() => onComplete(paymentMethod, selectedCustomer)}><span>Complete sale</span><strong>{money(total)}</strong></button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductModal({ onClose, onSubmit }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="form-modal" role="dialog" aria-modal="true" aria-labelledby="product-title"><header className="modal-header"><div><div className="panel-kicker">INVENTORY</div><h2 id="product-title">Add a product</h2></div><button className="icon-button" aria-label="Close" onClick={onClose}><X size={20} /></button></header><form onSubmit={onSubmit}><label className="field-label">Product name<input name="name" placeholder="e.g. Amul Taaza Milk" required autoFocus /></label><div className="form-row"><label className="field-label">Category<select name="category"><option>Staples</option><option>Dairy</option><option>Snacks</option><option>Cooking oil</option><option>Beverages</option><option>Other</option></select></label><label className="field-label">Unit<input name="unit" placeholder="pack, kg, litre" /></label></div><div className="form-row"><label className="field-label">Selling price (₹)<input name="price" type="number" min="0" step="0.5" placeholder="0.00" required /></label><label className="field-label">Opening stock<input name="stock" type="number" min="0" step="1" placeholder="0" required /></label></div><div className="form-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary"><Plus size={16} />Save product</button></div></form></section></div>;
}

export default App;