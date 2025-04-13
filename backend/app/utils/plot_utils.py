import matplotlib
matplotlib.use('Agg')
from matplotlib.figure import Figure
import io
import base64

def generate_bar_plot(x, y, title, xlabel, ylabel, color):
    """Utility function to generate bar plots"""
    fig = Figure()
    ax = fig.subplots()
    bars = ax.bar(x, y, color=color)
    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    
    # Add value labels on top of each bar
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{int(height)}',
                ha='center', va='bottom')
    
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches='tight')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    return img_base64