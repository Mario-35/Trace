 #/
 # Stean Bash.
 #
 # @copyright 2024-present Inrae
 # @author mario.adam@inrae.fr 
 # version 1.1
 #
 #/

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
    echo "pm2 start ./trace/main.js --watch --ignore-watch \"node_modules\"" >> $FILERUN
    echo "pm2 logs --lines 500" >> $FILERUN
    sudo chmod -R 777 $FILERUN
    echo "Create script => $FILERUN"
}


# Function to check Node and install it if not
check_node() {
    if ! command -v node > /dev/null
    then
        echo "Installing Node..."
        sudo  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
        sudo apt install nodejs
        NODEVER=$(node -v) 
    else
        NODEVER=$(node -v) 
    fi    
}

# Function to check PostgreSQL-postgis and install it if not
check_gnupg() {
    if which gpg >/dev/null; then 
        echo "gnupg2 Installed"
    else
        echo "gnupg2 Not installed" #If not installed
        echo "gnupg2 Installing..."
        sudo apt install gnupg2 #installation
    fi
}

# Function to check PostgreSQL-postgis and install it if not
check_pg() {
    if ! psql --version | grep -q "psql (PostgreSQL)"; then
        echo "Installing postgresql-postgis ..."
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
        echo "Installing pm2..."
        sudo npm install pm2@latest -g
        PM2VER=$(pm2 -v) 
    else
        PM2VER=$(pm2 -v) 
    fi    
}

# Function to check unzip and install it if not
check_unzip() {
    if ! command -v unzip > /dev/null
    then
        echo "Installing unzip..."
        sudo apt-get install unzip
    else
        echo "unzip is already installed."
    fi
}

# Function to check dist file
check_dist() {
    # Check if file already present and ask to use it if true
    if [ -f $FILEDIST ]; then
        echo "$FILEDIST is already present."
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
        echo "Delete => $FILEDISTOLD"
        mv $FILEDIST $FILEDISTOLD
        echo "Move $FILEDIST => $FILEDISTOLD"
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

check_gnupg;
check_pg;
check_node;
check_pm2;
check_unzip;
check_dist
stop_trace
install_trace
create_run_script;