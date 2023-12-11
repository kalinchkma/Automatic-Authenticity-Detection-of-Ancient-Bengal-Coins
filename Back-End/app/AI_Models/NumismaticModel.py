import torch
import torchvision
from torchvision import transforms
from torch import nn
import torchvision.models as models
import os
from PIL import Image
import numpy as np

# set torch home
path = os.getcwd() + '/models'
os.environ['TORCH_HOME'] = path


def preprocess_image(image):
    image = np.array(image)[..., :3]
    image = Image.fromarray(image)
    # preprocess parameter
    CROP_SIZE=244
    MEAN=[0.485, 0.456, 0.406]
    STD=[0.229, 0.224, 0.225]

    # transform
    preprocess = transforms.Compose([
        transforms.Resize(size=(244, 244)),
        transforms.ToTensor(),
        transforms.Normalize(mean=MEAN, std=STD)
    ])
    
    return preprocess(image).unsqueeze(dim=0)

class Resnet50BinaryCLF(nn.Module):
    def __init__(self):
        super().__init__()
        # get derfaul weight
        weights = models.ResNet50_Weights.DEFAULT
        self.resnet50 = models.resnet50(weights=weights)

        # add FC layer for binary classification
        self.resnet50.fc = torch.nn.Sequential(
            nn.Linear(self.resnet50.fc.in_features, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, 1)
        )
    def forward(self, x):
        return self.resnet50(x)

resnet50 = Resnet50BinaryCLF()

# load model check point
path = os.getcwd() + "/models/resnet50/resnet50_v0.pth"
checkpoint = torch.load(path, map_location=torch.device('cpu'))
resnet50.load_state_dict(checkpoint)


def predict(img, model=resnet50):
    img = preprocess_image(img)
    model.eval()
    with torch.inference_mode():
        pred = model(img)
    
    return torch.round(torch.sigmoid(pred)).item()

