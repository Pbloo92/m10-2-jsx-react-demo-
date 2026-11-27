
import { useState } from 'react';

// ============================================================================
// [CLAVE EXPOSICIÓN 5] EVENTOS EN JSX Y SEGURIDAD AUTOMÁTICA CONTRA XSS
// ----------------------------------------------------------------------------
// 1. EVENTOS:
//    - En HTML: onclick="saludar()" (cadena de texto).
//    - En JSX:  onClick={saludar}   (referencia a función en camelCase).
//    - Si necesita argumentos: onClick={() => saludar('DAM2')}.
//      ¡ERROR TÍPICO!: escribir onClick={saludar('DAM2')} ejecuta la función
//      inmediatamente al renderizar, no al hacer clic.
// 2. PREVENCIÓN DE XSS (Cross-Site Scripting):
//    - JSX escapa automáticamente cualquier cadena insertada dentro de { }.
//    - Si un atacante introduce `<script>` o `<img onerror=...>`, React lo
//      pinta como texto plano seguro sin ejecutar código JavaScript.
// ============================================================================

export default function EventosYSeguridadXSS() {
  const [ultimoEvento, setUltimoEvento] = useState('Ninguno todavía');
  const [historial, setHistorial] = useState([]);
  const [entradaUsuario, setEntradaUsuario] = useState(
    "<img src=x onerror='alert(\"Ataque XSS\")' /> <script>alert(\"Hack\")</script>"
  );

  // Registramos el evento y conservamos únicamente los últimos 5
  const registrarEvento = (mensaje) => {
    const evento = `${mensaje} a las ${new Date().toLocaleTimeString()}`;
    setUltimoEvento(evento);
    setHistorial((prev) => [evento, ...prev].slice(0, 5));
  };

  // Manejador sin parámetros (se pasa como referencia: onClick={manejarClickSimple})
  const manejarClickSimple = () => {
    registrarEvento('Clic simple registrado');
  };

  // Manejador con parámetros (requiere función flecha: onClick={() => manejarConParametro(...)})
  const manejarConParametro = (accion) => {
    registrarEvento(`Acción ejecutada con parámetro: "${accion}"`);
  };

  // Cadenas de prueba XSS: se muestran como texto, no se ejecutan
  const pruebasXSS = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    '<svg onload=alert("XSS")></svg>'
  ];

  const cargarPruebaXSS = (payload) => {
    setEntradaUsuario(payload);
    registrarEvento('Payload XSS de prueba seleccionado');
  };

  const limpiarHistorial = () => {
    setHistorial([]);
    setUltimoEvento('Ninguno todavía');
  };

  return (
    <section className="card">
      <h2>5. Manejo de Eventos y Protección Nativa contra XSS</h2>
      <p className="subtitle">
        Prueba los botones de eventos y comprueba cómo JSX neutraliza automáticamente código HTML/JS malicioso.
      </p>

      <div className="grid-2">
        <div className="box box-success">
          <h3>Sintaxis de Eventos (Synthetic Events)</h3>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
            Último evento: <strong style={{ color: '#38bdf8' }}>{ultimoEvento}</strong>
          </p>
          <div className="btn-row">
            {/* Referencia directa a la función */}
            <button type="button" className="btn" onClick={manejarClickSimple}>
              onClick=&#123;fn&#125;
            </button>
            {/* Función flecha para pasar argumentos sin ejecutar en el render */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => manejarConParametro('Exportar PDF')}
            >
              onClick=&#123;() =&gt; fn(arg)&#125;
            </button>
          </div>

          <h3 style={{ marginTop: '1rem' }}>Historial de eventos (máximo 5)</h3>
          <button
            type="button"
            className="btn btn-danger"
            onClick={limpiarHistorial}
            disabled={historial.length === 0}
          >
            Limpiar historial
          </button>

          {historial.length === 0 ? (
            <p className="subtitle" style={{ marginTop: '0.75rem' }}>
              No hay eventos registrados.
            </p>
          ) : (
            <ul className="list" style={{ marginTop: '0.75rem' }}>
              {historial.map((evento, index) => (
                <li key={`${evento}-${index}`} className="list-item">
                  {evento}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="box box-warn">
          <h3>Escapado automático contra XSS</h3>
          <label htmlFor="xss-input">Introduce HTML o un payload XSS:</label>
          <input
            id="xss-input"
            type="text"
            className="input"
            value={entradaUsuario}
            onChange={(e) => setEntradaUsuario(e.target.value)}
          />

          <p style={{ marginTop: '0.75rem' }}>
            <strong>Pruebas XSS:</strong>
          </p>
          <div className="btn-row">
            {pruebasXSS.map((payload, index) => (
              <button
                key={index}
                type="button"
                className="btn btn-secondary"
                onClick={() => cargarPruebaXSS(payload)}
              >
                Prueba XSS {index + 1}
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.65rem',
              backgroundColor: '#1e293b',
              borderRadius: '8px',
              fontFamily: 'Consolas, monospace',
              fontSize: '0.85rem',
              wordBreak: 'break-all'
            }}
          >
            {/* JSX escapa automáticamente esta cadena: NO se ejecuta el script */}
            Salida renderizada segura: {entradaUsuario}
          </div>
        </div>
      </div>

      <p className="file-hint">
        Archivo para mostrar en VS Code: <code className="code-inline">src/components/05_EventosYSeguridadXSS.jsx</code>
      </p>
    </section>
  );
}
