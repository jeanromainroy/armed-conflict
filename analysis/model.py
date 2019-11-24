# Import Libs

from joblib import dump, load
from keras.models import load_model

class Model:

    def __init__(self, weight_rdf, weight_cnn):

        # Validate input
        if(weight_cnn + weight_rdf != 1.0):
            raise Exception("ERROR: Weights do not amount to 1.0")


        # Load Models
        try:
            rdf_classifier = load('data/model/model.joblib')
            print("RDF classifier loaded!")
        except:
            raise Exception("ERROR: RDF not loaded")
            
        try:
            cnn_classifier = load_model('data/model/model_cnn.h5')
            print("CNN classifier loaded!")
        except:
            raise Exception("ERROR: CNN not loaded")
            
        # Load Scaler
        try:
            scaler = load('data/model/scaler.joblib')
            print("Scaler loaded!")
        except:
            raise Exception("ERROR: Scaler not loaded")

        
        # set attributes
        self.rdf_classifier = rdf_classifier
        self.cnn_classifier = cnn_classifier
        self.scaler = scaler
        self.weight_cnn = weight_cnn
        self.weight_rdf = weight_rdf

    
    def predict(self, x):

        # Scale
        x_n = self.scaler.transform(x)
        
        # get prediction from the models
        rdf_preds = self.rdf_classifier.predict_proba(x)
        cnn_preds = self.cnn_classifier.predict(x_n)
        
        # init array
        predictions = []
        
        # go through
        for i in range(0,len(x)):
            
            # get preds
            rdf_pred = rdf_preds[i]
            cnn_pred = cnn_preds[i][0]
        
            # different rdf scenarios
            if(rdf_pred[0] > rdf_pred[1]):
                rdf_pred = 1.0 - rdf_pred[0]

            elif(rdf_pred[1] > rdf_pred[0]):
                rdf_pred = rdf_pred[1]

            else:
                rdf_pred = 0.5
        
            # get weighted average 
            ave_pred = rdf_pred*self.weight_rdf + cnn_pred*self.weight_cnn
            
            # add to final array
            predictions.append(ave_pred)
        
        return predictions


