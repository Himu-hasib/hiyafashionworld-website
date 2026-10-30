import { Link } from 'react-router-dom';
import { useState } from 'react';

const categories = [
  { name: 'Three Piece', key: 'three_piece', subs: ['Pakistani', 'Indian', 'Bangladeshi'] },
  { name: 'Kurti', key: 'kurti', subs: [] },
  { name: 'Ready Made Three Piece', key: 'ready_three_piece', subs: [] },
  { name: 'Crochet', key: 'crochet', subs: ['Neck', 'Table Mate', 'Bag', 'Shawl'] },
  { name: 'Bag', key: 'bag', subs: [] },
  { name: 'Ornaments', key: 'ornaments', subs: [] }
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  return (
    <div className="position-relative d-inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="btn btn-danger px-4 rounded-pill shadow-sm fw-bold">☰ All Categories</button>
      {open && (
        <div className="position-absolute bg-white shadow-lg rounded mt-2 sidebar-menu" style={{ zIndex: 100 }}>
          {categories.map(c => (
            <div key={c.key} className="position-relative" onMouseEnter={() => setHovered(c.key)} onMouseLeave={() => setHovered(null)}>
              <Link to={`/category/${c.key}`} className="d-block px-4 py-2 text-decoration-none text-dark border-bottom fw-medium">
                {c.name}
              </Link>
              {c.subs.length > 0 && hovered === c.key && (
                <div className="position-absolute bg-white shadow-lg rounded" style={{ left: '100%', top: 0, minWidth: 180, zIndex: 101 }}>
                  {c.subs.map(s => (
                    <Link key={s} to={`/category/${c.key}?sub=${s.toLowerCase()}`} className="d-block px-4 py-2 text-decoration-none text-dark border-bottom small">
                      {s}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}