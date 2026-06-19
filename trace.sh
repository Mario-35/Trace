 #/
 # Stean Bash.
 #
 # @copyright 2024-present Inrae
 # @author mario.adam@inrae.fr 
 # version 1.1
 #
 #/

 #!/usr/bin/env bash
# Setup npm to install global packages without sudo
# Works on macOS and Linux
# This script is idempotent - safe to run multiple times


# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Helper functions
info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}


clear
# Name of the file downladed
FILEDIST=./dist.zip
# Name of the backup
FILEDISTOLD=./distOld.zip 
# Name of the run script
FILERUN=./run.sh

# Create run script
create_run_script() {
    if [ -f $FILERUN ]; then
        rm $FILERUN
        echo "Delete => $FILERUN"
    fi
    echo "#!/bin/bash" > $FILERUN
    echo "pm2 stop main" >> $FILERUN
    echo "pm2 flush" >> $FILERUN
    echo "pm2 delete main" >> $FILERUN
    echo "echo \"API starting ...\"" >> $FILERUN
    echo "export NODE_ENV=production" >> $FILERUN
    echo "pm2 start ./trace/main.js --env production --watch --ignore-watch" >> $FILERUN
    echo "pm2 logs --lines 500" >> $FILERUN
    sudo chmod -R 777 $FILERUN
    echo "Create script => $FILERUN"
}

# Function to check Node and install it if not
check_node() {
    if ! command -v node > /dev/null
    then
        info "Installing Node..."
        sudo  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
        sudo apt install nodejs
        NODEVER=$(node -v) 
    else
        success "Node found"
        NODEVER=$(node -v) 
    fi    
}

# Detect shell configuration file
detect_shell_config() {
    if [[ -n "${BASH_VERSION:-}" ]]; then
        if [[ -f "$HOME/.bash_profile" ]]; then
            echo "$HOME/.bash_profile"
        else
            echo "$HOME/.bashrc"
        fi
    elif [[ -n "${ZSH_VERSION:-}" ]]; then
        echo "$HOME/.zshrc"
    else
        # Default to bashrc if we can't detect
        echo "$HOME/.bashrc"
    fi
}

config_node() {
    info "Setting up npm to install global packages without sudo..."
    
    # Check if npm is installed
    if ! command -v npm > /dev/null; then
        error "npm is not installed. Please install Node.js and npm first."
        exit 1
    fi
    
    NPM_GLOBAL_DIR="$HOME/.npm-global"
    SHELL_CONFIG=$(detect_shell_config)
    
    # Check current npm prefix
    CURRENT_PREFIX=$(npm config get prefix 2>/dev/null || echo "")
    
    # Check if already configured
    if [[ "$CURRENT_PREFIX" == "$NPM_GLOBAL_DIR" ]]; then
        success "npm is already configured to use $NPM_GLOBAL_DIR"
    else
        # Create npm global directory
        if [[ ! -d "$NPM_GLOBAL_DIR" ]]; then
            info "Creating $NPM_GLOBAL_DIR directory..."
            mkdir -p "$NPM_GLOBAL_DIR"
        fi
        
        # Configure npm prefix
        info "Configuring npm to use $NPM_GLOBAL_DIR..."
        npm config set prefix "$NPM_GLOBAL_DIR"
        success "npm prefix set to $NPM_GLOBAL_DIR"
    fi
    
    # Check if PATH already contains npm-global/bin
    if [[ ":$PATH:" == *":$NPM_GLOBAL_DIR/bin:"* ]]; then
        success "PATH already includes $NPM_GLOBAL_DIR/bin"
    else
        # Add to PATH in shell config
        info "Adding $NPM_GLOBAL_DIR/bin to PATH in $SHELL_CONFIG..."
        
        # Check if the export line already exists in shell config
        if grep -q "export PATH=\"\$HOME/.npm-global/bin:\$PATH\"" "$SHELL_CONFIG" 2>/dev/null; then
            warning "PATH export already exists in $SHELL_CONFIG"
        else
            # Add export to shell config
            echo '' >> "$SHELL_CONFIG"
            echo '# npm global packages path (added by setup-npm-global.sh)' >> "$SHELL_CONFIG"
            echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> "$SHELL_CONFIG"
            success "Added PATH export to $SHELL_CONFIG"
            
            warning "You need to reload your shell configuration:"
            echo "  Run: source $SHELL_CONFIG"
            echo "  Or start a new terminal session"
        fi
    fi
    
    echo ""
    success "npm global setup complete!"
    echo ""
    info "You can now install global packages without sudo:"
    echo "  npm install -g <package-name>"
    echo ""
    
    # Show current configuration
    info "Current configuration:"
    echo "  npm prefix: $(npm config get prefix)"
    echo "  Shell config: $SHELL_CONFIG"
    
    # Check if we need to reload
    if [[ ":$PATH:" != *":$NPM_GLOBAL_DIR/bin:"* ]]; then
        echo ""
        warning "Don't forget to reload your shell configuration!"
        echo "  Run: source $SHELL_CONFIG"
    fi
}

# Function to check PostgreSQL-postgis and install it if not
check_sudo() {
    if which sudo >/dev/null; then 
        info "sudo Installed"
    else
        warning "sudo Not installed" #If not installed
        sudo apt install sudo #installation
    fi
}

# Function to check PostgreSQL-postgis and install it if not
check_gnupg() {
    if which gpg >/dev/null; then 
        info "gnupg2 Installed"
    else
        warning "gnupg2 Not installed" #If not installed
        sudo apt install gnupg2 #installation
    fi
}

# Function to check PostgreSQL-postgis and install it if not
check_pg() {
    if ! psql --version | grep -q "psql (PostgreSQL)"; then
        warning "Installing postgresql-postgis ..."
        sudo install -d /usr/share/postgresql-common/pgdg
        sudo curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc
        sudo sh -c 'echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
        sudo apt update
        sudo apt install postgresql-17-postgis-3 -y
            if ! psql --version | grep -q "psql (PostgreSQL)"; then
            exit
        fi
        sudo -i -u postgres psql -c "SELECT PostGIS_version();"    
        sudo -i -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"    
        sudo -i -u postgres psql -c "CREATE USER trace WITH PASSWORD 'trace';"
        sudo -i -u postgres psql -c "CREATE database trace"
        update_pg_hba
        PGVER=$(psql --version)
    else
        INFO "postgresql installed"
        PGVER=$(psql --version)
    fi  
}

# Function to create PostgreSQL default postcres user
update_pg_hba() {
    SQLPATH=/etc/postgresql/17/main/pg_hba.conf
    sudo cp $SQLPATH $SQLPATH.bak
    if [ -f $SQLSCRIPT ]; then
        echo "rm $SQLSCRIPT"
        rm $SQLSCRIPT
        echo "Delete => $SQLSCRIPT"
    fi
    echo "create table hba ( lines text );" > $SQLSCRIPT
    echo "hba from ($SQLPATH);" >> $SQLSCRIPT
    echo "insert into hba (lines) values ('host    all             all             0.0.0.0/0            md5');" >> $SQLSCRIPT
    echo "insert into hba (lines) values ('listen_addresses = ''*''');" >> $SQLSCRIPT
    echo "copy hba to '$SQLPATH';" >> $SQLSCRIPT
    echo "select pg_infos_conf();" >> $SQLSCRIPT
    sudo psql -U postgres -f $SQLSCRIPT
    rm $SQLSCRIP
}

# Function to check pm2 and install it if not
check_pm2() {
    if ! command -v pm2 > /dev/null
    then
        warning "Installing pm2..."
        sudo npm install pm2@latest -g
        PM2VER=$(pm2 -v) 
    else
        INFO "pm2 installed"
        PM2VER=$(pm2 -v) 
    fi    
}

# Function to check unzip and install it if not
check_unzip() {
    if ! command -v unzip > /dev/null
    then
        warning "Installing unzip..."
        sudo apt-get install unzip
    else
        info "unzip is already installed."
    fi
}

# Function to check dist file
check_dist() {
    # Check if file already present and ask to use it if true
    if [ -f $FILEDIST ]; then
        warning "$FILEDIST is already present."
        while true; do
            read -p "Do you wish to use it " yn
            case $yn in
                [Yy]* ) break;;
                [Nn]* ) download_dist; break;;
                * ) echo "Please answer yes or no.";;
            esac
        done
    else
        download_dist
    fi
}

# Function to make bak 
save_dist() {
    if [ -f "$FILEDIST" ]; then
        rm -f $FILEDISTOLD
        info "Delete => $FILEDISTOLD"
        mv $FILEDIST $FILEDISTOLD
        info "Move $FILEDIST => $FILEDISTOLD"
    fi
}

# Function to get trace
download_dist() {
    save_dist
    sudo curl -L -O https://github.com/Mario-35/trace/raw/refs/heads/main/dist.zip
}

# Function to install trace
install_trace() {
    # save actual to bak
    if [ -f ./trace ]; then
        # remove bak
        if [ -f ./traceBak ]; then
            rm -r ./traceBak
            echo "Delete => ./traceBak"
        fi
        save_configuration
        mv ./trace ./traceBak
        echo "Move ./trace => ./traceBak"
    fi
    # create path
    # unzip actual
    unzip -qq -o $FILEDIST -d ./trace/
    mv ./dist ./trace
    save_dist
    npm install --omit=dev --prefix ./trace/
}

# Function to stop trace
stop_trace() {
    echo "API Stopping ..."
    pm2 stop main
    pm2 kill
}

# Function to run trace
run_trace() {
    echo "API starting ..."
    NODE_ENV=production
    pm2 start ./trace/main.js
}
    
check_sudo;
check_gnupg;
check_pg;
check_node;
config_node;
check_pm2;
check_unzip;
check_dist
stop_trace
install_trace
create_run_script;