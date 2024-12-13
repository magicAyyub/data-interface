from flask import  jsonify, Blueprint
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
from app.utils.enhanced_fraud_detector import EnhancedFraudDetector


board_bp = Blueprint('dashboard', __name__)

# Initialisation du détecteur de fraude
detector = EnhancedFraudDetector('processed_data.csv', 'MAJNUM.csv')

@board_bp.route('/api/fraud/summary', methods=['GET'])
def get_fraud_summary() -> Tuple[Dict, int]:
    """
    Endpoint pour obtenir un résumé des analyses de fraude.
    Inclut les statistiques globales et la distribution des risques.
    """
    report, risk_scores, final_df = detector.generate_comprehensive_report()
    
    # Calcul des statistiques temporelles
    current_date = datetime.now()
    last_week = current_date - timedelta(days=7)
    
    recent_accounts = final_df[
        pd.to_datetime(final_df['CREATED_DATE']) > last_week
    ]
    
    summary = {
        'global_stats': report['summary'],
        'recent_activity': {
            'new_accounts_last_week': len(recent_accounts),
            'high_risk_last_week': len(
                recent_accounts[recent_accounts['total_risk'] > 3]
            )
        },
        'risk_distribution': report['risk_distribution']
    }
    
    return jsonify(summary), 200

@board_bp.route('/api/fraud/phone-analysis', methods=['GET'])
def get_phone_analysis() -> Tuple[Dict, int]:
    """
    Endpoint pour l'analyse détaillée des anomalies téléphoniques.
    """
    report, _, final_df = detector.generate_comprehensive_report()
    
    phone_stats = {
        'anomalies': report['phone_analysis'],
        'operator_distribution': final_df['Operateur'].value_counts().to_dict(),
        'territory_analysis': final_df['Territoire'].value_counts().to_dict(),
        'recent_changes': len(final_df[final_df['DATE_MODF_TEL'].notna()])
    }
    
    return jsonify(phone_stats), 200

@board_bp.route('/api/fraud/email-analysis', methods=['GET'])
def get_email_analysis() -> Tuple[Dict, int]:
    """
    Endpoint pour l'analyse détaillée des emails suspects.
    """
    report, _, _ = detector.generate_comprehensive_report()
    
    email_stats = {
        'patterns': report['email_analysis'],
        'timeline': {
            'last_24h': 25,  # À remplacer par des données réelles
            'last_week': 145,
            'last_month': 580
        }
    }
    
    return jsonify(email_stats), 200

@board_bp.route('/api/fraud/geographic', methods=['GET'])
def get_geographic_analysis() -> Tuple[Dict, int]:
    """
    Endpoint pour l'analyse de la cohérence géographique.
    """
    _, _, final_df = detector.generate_comprehensive_report()
    
    geo_analysis = {
        'country_distribution': final_df['COGPAYS'].value_counts().to_dict(),
        'mismatches': final_df[
            final_df['COGPAYS'] != final_df['Territoire']
        ].groupby(['COGPAYS', 'Territoire']).size().to_dict()
    }
    
    return jsonify(geo_analysis), 200

@board_bp.route('/api/fraud/high-risk', methods=['GET'])
def get_high_risk_accounts() -> Tuple[Dict, int]:
    """
    Endpoint pour obtenir les détails des comptes à haut risque.
    """
    _, risk_scores, final_df = detector.generate_comprehensive_report()
    
    high_risk = risk_scores[risk_scores['total_risk'] > 3]
    high_risk_details = []
    
    for _, row in high_risk.iterrows():
        account_details = final_df[final_df['ID_CCU'] == row['ID_CCU']].iloc[0]
        high_risk_details.append({
            'id': row['ID_CCU'],
            'risk_score': row['total_risk'],
            'phone_risk': row['phone_risk'],
            'email_risk': row['email_risk'],
            'created_date': account_details['CREATED_DATE'],
            'country': account_details['COGPAYS'],
            'operator': account_details.get('Operateur', 'Unknown')
        })
    
    return jsonify(high_risk_details), 200

@board_bp.route('/api/fraud/refresh', methods=['POST'])
def refresh_analysis() -> Tuple[Dict, int]:
    """
    Endpoint pour rafraîchir l'analyse complète.
    """
    try:
        detector.load_data()  # Recharge les données
        report, _, _ = detector.generate_comprehensive_report()
        return jsonify({'status': 'success', 'timestamp': datetime.now().isoformat()})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
