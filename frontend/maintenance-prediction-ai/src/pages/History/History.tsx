import React, { useEffect, useState } from 'react';
import { getPredictionHistory, deleteHistoryItem, clearPredictionHistory } from '../../services/predictionService';
import type { PredictionHistoryItem } from '../../types/prediction';
import { FiTrash2, FiEye, FiFilter, FiRefreshCw, FiAlertTriangle, FiX } from 'react-icons/fi';
import styles from './History.module.css';

export const History: React.FC = () => {
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PredictionHistoryItem | null>(null);
  
  // Filters
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    setHistory(getPredictionHistory());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Deseja realmente excluir este registro?')) {
      const updated = deleteHistoryItem(id);
      setHistory(updated);
      window.dispatchEvent(new CustomEvent('historyUpdate'));
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Tem certeza de que deseja apagar TODO o histórico? Esta ação é irreversível.')) {
      clearPredictionHistory();
      setHistory([]);
      window.dispatchEvent(new CustomEvent('historyUpdate'));
    }
  };

  const handleResetFilters = () => {
    setRiskFilter('ALL');
    setTypeFilter('ALL');
    setSearchTerm('');
  };

  // Filter logic
  const filteredHistory = history.filter((item) => {
    const isHigh = item.response.prediction === 1;
    const isMed = !isHigh && item.response.probability >= 25;
    
    // Determine risk category
    let riskCat = 'LOW';
    if (isHigh) riskCat = 'HIGH';
    else if (isMed) riskCat = 'MEDIUM';

    // Risk Filter
    if (riskFilter !== 'ALL' && riskFilter !== riskCat) return false;

    // Type Filter
    if (typeFilter !== 'ALL' && item.request.type !== typeFilter) return false;

    // Search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchName = item.equipmentName.toLowerCase().includes(term);
      const matchMsg = item.response.message.toLowerCase().includes(term);
      if (!matchName && !matchMsg) return false;
    }

    return true;
  });

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Filters Toolbar */}
      <div className={`glass-panel ${styles.filtersPanel}`}>
        <div className={styles.filterHeader}>
          <div className={styles.filterTitle}>
            <FiFilter />
            <h3>Filtros de Pesquisa</h3>
          </div>
          <div className={styles.actionsBtn}>
            <button className={styles.clearBtn} onClick={handleClearAll} disabled={history.length === 0}>
              <FiTrash2 /> Limpar Histórico
            </button>
            <button className={styles.resetBtn} onClick={handleResetFilters}>
              <FiRefreshCw /> Resetar
            </button>
          </div>
        </div>

        <div className={styles.filterGrid}>
          <div className={styles.filterField}>
            <label htmlFor="search">Pesquisar Equipamento</label>
            <input
              id="search"
              type="text"
              placeholder="Ex: Torno, CNC, Fresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.filterField}>
            <label htmlFor="risk">Nível de Risco</label>
            <select id="risk" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="ALL">Todos os Riscos</option>
              <option value="HIGH">Alto Risco (Crítico)</option>
              <option value="MEDIUM">Risco Médio (Atenção)</option>
              <option value="LOW">Baixo Risco (Saudável)</option>
            </select>
          </div>

          <div className={styles.filterField}>
            <label htmlFor="class">Categoria do Ativo</label>
            <select id="class" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="ALL">Todas as Categorias</option>
              <option value="L">Variante L (Qualidade L)</option>
              <option value="M">Variante M (Qualidade M)</option>
              <option value="H">Variante H (Qualidade H)</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className={`glass-panel ${styles.tableCard}`}>
        <div className={styles.tableWrapper}>
          {filteredHistory.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ativo</th>
                  <th>Variante</th>
                  <th>Telemetria (Temp / Speed / Torque / Wear)</th>
                  <th>Prob. Falha</th>
                  <th>Status Diagnóstico</th>
                  <th>Data da Análise</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => {
                  const isHigh = item.response.prediction === 1;
                  const isMed = !isHigh && item.response.probability >= 25;

                  let badgeClass = styles.badgeLow;
                  let badgeText = 'Saudável';

                  if (isHigh) {
                    badgeClass = styles.badgeHigh;
                    badgeText = 'Parada Crítica';
                  } else if (isMed) {
                    badgeClass = styles.badgeMed;
                    badgeText = 'Atenção';
                  }

                  return (
                    <tr
                      key={item.id}
                      className={styles.clickableRow}
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className={styles.equipmentName}>{item.equipmentName}</td>
                      <td>
                        <span className={styles.typeBadge}>{item.request.type}</span>
                      </td>
                      <td className={styles.telemetryCell}>
                        <span>{(item.request.process_temperature - 273.15).toFixed(1)}°C</span>
                        <span>/</span>
                        <span>{item.request.rotational_speed} rpm</span>
                        <span>/</span>
                        <span>{item.request.torque} Nm</span>
                        <span>/</span>
                        <span>{item.request.tool_wear} min</span>
                      </td>
                      <td className={styles.probCell}>
                        <span className={isHigh ? styles.textHigh : isMed ? styles.textMed : styles.textLow}>
                          {item.response.probability}%
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${badgeClass}`}>
                          {badgeText}
                        </span>
                      </td>
                      <td className={styles.dateCell}>
                        {new Date(item.timestamp).toLocaleString('pt-BR')}
                      </td>
                      <td>
                        <div className={styles.rowActions}>
                          <button
                            className={styles.rowBtnEye}
                            title="Ver Detalhes"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                            }}
                          >
                            <FiEye />
                          </button>
                          <button
                            className={styles.rowBtnTrash}
                            title="Excluir Registro"
                            onClick={(e) => handleDelete(item.id, e)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyTable}>
              <FiAlertTriangle size={32} className={styles.emptyIcon} />
              <p>Nenhum registro encontrado para os filtros selecionados.</p>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className={styles.modalOverlay} onClick={() => setSelectedItem(null)}>
          <div className={`glass-panel ${styles.modal}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Detalhes do Diagnóstico</h2>
                <span className={styles.modalSub}>{selectedItem.equipmentName}</span>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedItem(null)}>
                <FiX />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalGrid}>
                {/* Result Section */}
                <div className={styles.modalCol}>
                  <h3 className={styles.sectionTitle}>Análise do Modelo ML</h3>
                  
                  <div className={styles.modalMetric}>
                    <span className={styles.label}>Previsão de Parada</span>
                    <span className={`${styles.value} ${selectedItem.response.prediction === 1 ? styles.textHigh : styles.textLow}`}>
                      {selectedItem.response.prediction === 1 ? 'REQUERIDA (Sim)' : 'NÃO REQUERIDA (Não)'}
                    </span>
                  </div>

                  <div className={styles.modalMetric}>
                    <span className={styles.label}>Probabilidade de Falha</span>
                    <span className={styles.value}>{selectedItem.response.probability}%</span>
                  </div>

                  <div className={styles.modalMetric}>
                    <span className={styles.label}>Diagnóstico Detalhado</span>
                    <p className={styles.descText}>{selectedItem.response.message}</p>
                  </div>

                  <div className={styles.modalMetric}>
                    <span className={styles.label}>Plano de Ação Recomendado</span>
                    <p className={styles.descText}>{selectedItem.response.recommendation}</p>
                  </div>
                </div>

                {/* Telemetries Section */}
                <div className={styles.modalCol}>
                  <h3 className={styles.sectionTitle}>Telemetria Recebida</h3>
                  
                  <div className={styles.telemetrySpecs}>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Classe do Ativo</span>
                      <span className={styles.specVal}>Variante {selectedItem.request.type}</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Temp. Ambiente</span>
                      <span className={styles.specVal}>{(selectedItem.request.air_temperature - 273.15).toFixed(2)} °C ({selectedItem.request.air_temperature} K)</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Temp. do Eixo/Processo</span>
                      <span className={styles.specVal}>{(selectedItem.request.process_temperature - 273.15).toFixed(2)} °C ({selectedItem.request.process_temperature} K)</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Velocidade Rotacional</span>
                      <span className={styles.specVal}>{selectedItem.request.rotational_speed} RPM</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Força de Torque</span>
                      <span className={styles.specVal}>{selectedItem.request.torque} Nm</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Uso da Ferramenta</span>
                      <span className={styles.specVal}>{selectedItem.request.tool_wear} minutos</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raw JSON details */}
              <div className={styles.rawJson}>
                <h3 className={styles.sectionTitle}>Payload de Comunicação (Raw JSON)</h3>
                <pre className={styles.codeBlock}>
                  {JSON.stringify({ request: selectedItem.request, response: selectedItem.response }, null, 2)}
                </pre>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.closeModalBtn} onClick={() => setSelectedItem(null)}>
                Fechar Diagnóstico
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
