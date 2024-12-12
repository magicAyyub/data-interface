import pandas as pd

def clean_datetime(value: str) -> str:
        """
        Nettoie et valide les valeurs de date.
        Gère les cas spéciaux comme les dates avec mois ou jours à 0.
        """
        if pd.isna(value) or value is None:
            return None
            
        # Retirer le timezone s'il est présent
        if '+' in value:
            value = value.split('+')[0].strip()
        elif '-' in value and value.count('-') > 2:
            value = value.rsplit('-', 1)[0].strip()
        
        # Gérer les cas où le mois ou le jour sont à 0
        if '-00-' in value or value.endswith('-00'):
            parts = value.split('-')
            year = parts[0]
            month = '01' if parts[1] == '00' else parts[1]
            day = '01' if len(parts) > 2 and parts[2] == '00' else parts[2]
            value = f"{year}-{month}-{day}"
            
        # Vérifier si la date est valide
        try:
            parsed_date = pd.to_datetime(value)
            if parsed_date.year < 1900:  # Gérer les dates trop anciennes
                raise "date improbable"
            return parsed_date.strftime('%Y-%m-%d %H:%M:%S')
        except:
            raise f"erreur de formatage pour : {parsed_date}"